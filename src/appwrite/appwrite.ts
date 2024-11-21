"use server";

import { cookies } from "next/headers";
import { appwriteConfig } from "./appwriteConfig";
import { Client, Account, Databases, Storage, Users } from "node-appwrite";

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId);

    const session = (await cookies()).get("my-custom-session");
    if (session?.value) {
        client.setSession(session.value);
    }

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        },
    };
}

export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.appwriteSecret);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        },
        get users() {
            return new Users(client);
        }
    };
}
