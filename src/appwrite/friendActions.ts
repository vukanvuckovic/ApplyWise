"use server";
import { Models, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "./appwrite";
import { appwriteConfig } from "./appwriteConfig";
import { getUsers } from "./userActions";

export const addFriend = async (requestForId: string, currentUser: string) => {
  const { databases } = await createAdminClient();
  try {
    const doc1 = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      currentUser
    );

    const doc2 = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      requestForId
    );

    if (
      doc1.friendRequests.includes(requestForId) &&
      doc2.sentRequests.includes(currentUser)
    ) {
      await acceptFriend(requestForId, currentUser);
      return { status: true };
    }

    if (
      !doc2.friendRequests.includes(currentUser) &&
      !doc1.sentRequests.includes(requestForId) &&
      !doc1.friends.includes(requestForId) &&
      !doc2.friends.includes(currentUser) &&
      requestForId !== currentUser
    ) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        requestForId,
        {
          friendRequests: [...doc2.friendRequests, currentUser],
        }
      );
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        currentUser,
        {
          sentRequests: [...doc1.sentRequests, requestForId],
        }
      );
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.error(error);
  }
};

export const cancelSentRequest = async (
  requestForId: string,
  currentUser: string
) => {
  const { databases } = await createAdminClient();
  try {
    const doc1 = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      currentUser
    );

    const doc2 = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      requestForId
    );

    if (
      doc1.sentRequests.includes(requestForId) &&
      doc2.friendRequests.includes(currentUser)
    ) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        currentUser,
        {
          sentRequests: doc1.sentRequests.filter(
            (item: string) => item !== requestForId
          ),
        }
      );
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        requestForId,
        {
          friendRequests: doc2.friendRequests.filter(
            (item: string) => item !== currentUser
          ),
        }
      );
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.error(error);
  }
};

export const acceptFriend = async (
  requestFromId: string,
  currentUser: string
) => {
  const { databases } = await createAdminClient();

  const doc1 = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    currentUser
  );

  const doc2 = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    requestFromId
  );
  try {
    if (
      !doc1.friends.includes(requestFromId) &&
      !doc2.friends.includes(currentUser) &&
      doc1.friendRequests.includes(requestFromId) &&
      doc2.sentRequests.includes(currentUser)
    ) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        currentUser,
        {
          friends: [...doc1.friends, requestFromId],
          friendRequests: doc1.friendRequests.filter(
            (item: string) => item !== requestFromId
          ),
        }
      );
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        requestFromId,
        {
          friends: [...doc2.friends, currentUser],
          sentRequests: doc2.sentRequests.filter(
            (item: string) => item !== currentUser
          ),
        }
      );
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.error(error);
  }
};

export const cancelFriend = async (
  requestFromId: string,
  currentUser: string
) => {
  const { databases } = await createAdminClient();

  const doc1 = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    currentUser
  );
  const doc2 = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    requestFromId
  );

  try {
    const request = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      currentUser,
      {
        friendRequests: doc1.friendRequests.filter(
          (item: string) => item !== requestFromId
        ),
      }
    );
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      requestFromId,
      {
        sentRequests: doc2.sentRequests.filter(
          (item: string) => item !== currentUser
        ),
      }
    );
    return { status: true, request: request };
  } catch (error) {
    console.error(error);
  }
};

export const removeFriend = async (removingId: string, currentUser: string) => {
  const { databases } = await createAdminClient();

  const doc1 = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    currentUser
  );

  const doc2 = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    removingId
  );

  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      currentUser,
      {
        friends: doc1.friends.filter((item: string) => item !== removingId),
      }
    );
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      removingId,
      {
        friends: doc2.friends.filter((item: string) => item !== currentUser),
      }
    );
    return { status: true };
  } catch (error) {
    console.error(error);
  }
};

//-----------------

export const getFriends = async ({
  friendsIdArr,
  limit = 5,
}: {
  friendsIdArr: string[];
  limit?: number;
}) => {
  const { databases } = await createSessionClient();

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("$id", friendsIdArr)]
    );

    const friends = response.documents.slice(0, limit);

    return { friends: friends, total: response.total };
  } catch (error) {
    console.error(error);
    return { friends: [], total: 0 };
  }
};

export const getFriendRequests = async ({
  friendReqIdArr,
}: {
  friendReqIdArr: string[];
}) => {
  try {
    const friendReqs: Models.Document[] = [];

    const users = await getUsers();

    users?.forEach((user) => {
      if (friendReqIdArr.includes(user.$id)) friendReqs.push(user);
    });

    return friendReqs;
  } catch (error) {
    console.error(error);
    return [];
  }
};
