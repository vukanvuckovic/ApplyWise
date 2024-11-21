"use server";
import { ID } from "appwrite";
import { createAdminClient, createSessionClient } from "./appwrite";
import { appwriteConfig } from "./appwriteConfig";
import { Query } from "node-appwrite";

export const getFiles = async (userId: string, limit = 5) => {
  const { databases } = await createSessionClient();
  try {
    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("accountId", userId), Query.limit(limit)]
    );

    return { files: res.documents, total: res.total };
  } catch (error) {
    console.error(error);
    return { files: [], total: 0 };
  }
};

export const uploadFile = async (file: File, userId: string) => {
  const { storage } = await createAdminClient();
  const { databases } = await createSessionClient();

  try {
    const storageFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );
    const dbFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      storageFile.$id,
      {
        name: storageFile.name,
        accountId: userId,
      }
    );
    return { status: true, file: dbFile };
  } catch (error) {
    console.error(error);
  }
};

export const deleteFile = async (fileId: string) => {
  const { storage } = await createAdminClient();
  const { databases } = await createSessionClient();
  try {
    await storage.deleteFile(appwriteConfig.bucketId, fileId);
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    return { status: true };
  } catch (error) {
    console.error(error);
  }
};

export const updateFile = async (fileId: string, name: string) => {
  const { storage } = await createAdminClient();
  const { databases } = await createSessionClient();
  try {
    const res = await storage.updateFile(appwriteConfig.bucketId, fileId, name);
    if (res) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        fileId,
        { name }
      );
    }
    return { status: true };
  } catch (error) {
    console.error(error);
  }
};
