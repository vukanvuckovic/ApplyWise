"use server";
import { ID, Query } from "appwrite";
import { appwriteConfig } from "./appwriteConfig";
import { createAdminClient } from "./appwrite";
import { getUser } from "./userActions";

interface ApplicationFormData {
  businessName?: string;
  position?: string;
  description?: string;
  status?: string;
}

export const createApplication = async (formData: ApplicationFormData) => {
    const { databases } = await createAdminClient();
    try {
        const user = await getUser();

        const res = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.applicationsCollectionId,
            ID.unique(),
            { ...formData, AccountId: user?.$id }
        );
        return { status: true, application: res };
    } catch (error) {
        console.error(error);
    }
};

export const updateApplication = async ({
    formData,
    applicationId,
}: {
    formData: ApplicationFormData;
    applicationId: string;
}) => {
    const { databases } = await createAdminClient();
    try {
        const res = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.applicationsCollectionId,
            applicationId,
            formData
        );
        return { status: true, application: res };
    } catch (error) {
        console.error(error);
    }
};

export const getApplications = async (limit = 5) => {
    const { databases } = await createAdminClient();
    try {
        const user = await getUser();
        if (user) {
            const res = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.applicationsCollectionId,
                [
                    Query.orderDesc("$createdAt"),
                    Query.equal("AccountId", user.$id),
                    Query.limit(limit),
                ]
            );
            return { applications: res.documents, total: res.total };
        }
    } catch (error) {
        console.error(error);
    }
};

export const deleteApplication = async ({ applicationId }: { applicationId: string }) => {
    const { databases } = await createAdminClient();
    try {
        const res = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.applicationsCollectionId,
            applicationId
        );
        return { status: true, application: res };
    } catch (error) {
        console.error(error);
    }
};
