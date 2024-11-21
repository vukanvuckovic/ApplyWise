"use server";
import { createAdminClient, createSessionClient } from "./appwrite";
import { cookies } from "next/headers";
import { appwriteConfig } from "./appwriteConfig";
import { Query, ID } from "node-appwrite";

export const getUsers = async (limit?: number, search?: string) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getUser();
    if (!currentUser) return;
    const queries = [Query.notEqual("$id", currentUser.$id)];

    if (limit) {
      queries.push(Query.limit(limit));
    }

    if (search) {
      queries.push(Query.search("name", search));
    }

    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      queries
    );

    return users.documents;
  } catch (error) {
    console.error(error);
  }
};

export async function getUser() {
  const { account } = await createSessionClient();
  try {
    return await account.get();
  } catch {
    return;
  }
}

export async function getDBUser() {
  const { databases } = await createSessionClient();
  const currentUser = await getUser();
  try {
    if (!currentUser) return { status: false };

    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      currentUser.$id
    );

    return { status: true, user: user };
  } catch (error) {
    console.error(error);
  }
}

export const logOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    (await cookies()).delete("my-custom-session");
    await account.deleteSession("current");

    return { status: true };
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (userData: {
  email: string;
  password: string;
  fullName: string;
  profession: string;
}) => {
  const { account, databases } = await createAdminClient();

  try {
    const user = await account.create(
      ID.unique(),
      userData.email,
      userData.password,
      userData.fullName
    );

    if (user) {
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        user.$id,
        {
          name: userData.fullName,
          friends: ["67aa4f1200056bbee597"],
          profession: userData.profession,
        }
      );
      const myUser = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        "67aa4f1200056bbee597"
      );
      const startingApplication = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.applicationsCollectionId,
        ID.unique(),
        {
          businessName: "Test Business",
          position: "Frontend Dev",
          description: "This is my first application on ApplyWise!",
          AccountId: newUser.$id,
        }
      );
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        newUser.$id,
        {
          applications: [startingApplication.$id],
        }
      );
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        "67aa4f1200056bbee597",
        {
          friends: [...myUser.friends, newUser.$id],
        }
      );
    }

    const session = await account.createEmailPasswordSession(
      userData.email,
      userData.password
    );

    (await cookies()).set("my-custom-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return { status: true, user: user };
  } catch (error) {
    console.error(error);
    return { status: false, error };
  }
};

export const updateUser = async (
  userInfo: { name: string; profession: string },
  userId: string
) => {
  const { databases, users } = await createAdminClient();
  try {
    await users.updateName(userId, userInfo.name);

    const dbUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      userInfo
    );

    return { status: true, dbUser: dbUser };
  } catch (error) {
    console.error(error);
  }
};

export const logInUser = async (email: string, password: string) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("my-custom-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return { status: true, session: session };
  } catch (error) {
    console.error(error);
  }
};

export const getStats = async (userId: string) => {
  const { databases } = await createAdminClient();
  try {
    const stats = {
      accepted: 0,
      rejected: 0,
      progressing: 0,
      pending: 0,
    };

    const userApplications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.applicationsCollectionId,
      [Query.equal("AccountId", userId)]
    );

    userApplications.documents.forEach((item) => {
      if (item.status === "Accepted") stats.accepted += 1;
      else if (item.status === "Rejected") stats.rejected += 1;
      else if (item.status === "Progressing") stats.progressing += 1;
      else if (item.status === "Pending") stats.pending += 1;
    });

    return stats;
  } catch (error) {
    console.error(error);
  }
};

// --------- Recovery

export const createRecovery = async (email: string, url: string) => {
  const { account } = await createSessionClient();
  try {
    const res = await account.createRecovery(email, url);
    return { status: true, res: res };
  } catch {
    return { status: false };
  }
};

export const confirmRecovery = async (
  userId: string,
  secret: string,
  password: string
) => {
  const { account } = await createAdminClient();
  try {
    const res = await account.updateRecovery(userId, secret, password);

    return { status: true, user: res };
  } catch {
    return { status: false };
  }
};
