"use server";
import { ID } from "appwrite";
import { appwriteConfig } from "./appwriteConfig";
import { createSessionClient } from "./appwrite";

interface NoteData {
    title: string;
    description: string;
    color: string;
    application: string;
}

export const createNote = async (noteData: NoteData) => {
    const { databases } = await createSessionClient();
    try {
        const res = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.notesCollectionId,
            ID.unique(),
            {
                title: noteData.title,
                description: noteData.description,
                color: noteData.color,
                application: noteData.application,
            }
        );
        return { status: true, note: res };
    } catch (error) {
        console.error(error);
    }
};

export const getNotes = async () => {
    const { databases } = await createSessionClient();
    try {
        const res = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.notesCollectionId,
        );
        return res.documents;
    } catch (error) {
        console.error(error);
    }
};

export const updateNote = async ({
    noteData,
    noteId,
}: {
    noteData: NoteData;
    noteId: string;
}) => {
    const { databases } = await createSessionClient();
    try {
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.notesCollectionId,
            noteId,
            {
                title: noteData.title,
                description: noteData.description,
                color: noteData.color,
                application: noteData.application,
            }
        );
        return true;
    } catch (error) {
        console.error(error);
    }
};

export const deleteNote = async ({ noteId }: { noteId: string }) => {
    const { databases } = await createSessionClient();
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.notesCollectionId,
            noteId
        );
        return true;
    } catch (error) {
        console.error(error);
    }
};
