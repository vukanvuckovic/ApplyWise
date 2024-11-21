export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    databaseId: process.env.NEXT_PUBLIC_DATABASE_ID!,
    bucketId: process.env.NEXT_PUBLIC_BUCKET_ID!,
    notesCollectionId: process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID!,
    filesCollectionId: process.env.NEXT_PUBLIC_FILES_COLLECTION_ID!,
    usersCollectionId: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
    applicationsCollectionId: process.env.NEXT_PUBLIC_APPLICATIONS_COLLECTION_ID!,
    appwriteSecret: process.env.NEXT_APPWRITE_SECRET!,
}