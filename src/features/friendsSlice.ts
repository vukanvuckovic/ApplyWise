'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Models } from 'node-appwrite';

interface initialState {
    friends?: Models.Document[];
    friendRequests?: Models.Document[];
    sentRequests?: string[];
}

const initialState: initialState = {
}

const friends = createSlice({
    name: "friends",
    initialState,
    reducers: {
        setFriends: (state, action: PayloadAction<Models.Document[] | undefined>) => {
            state.friends = action.payload;
        },
        addFriend: (state, action: PayloadAction<Models.Document>) => {
            state.friends = [action.payload, ...(state.friends ?? [])];
        },
        removeFriend: (state, action: PayloadAction<string>) => {
            state.friends = state.friends?.filter((item: Models.Document) => item.$id !== action.payload)
        },
        setFriendRequests: (state, action: PayloadAction<Models.Document[] | undefined>) => {
            state.friendRequests = action.payload;
        },
        removeRequest: (state, action: PayloadAction<string>) => {
            state.friendRequests = state.friendRequests?.filter((item: Models.Document) => item.$id !== action.payload);
        },
        setSentReqs: (state, action: PayloadAction<string[] | undefined>) => {
            state.sentRequests = action.payload;
        },
        sendRequest: (state, action: PayloadAction<string>) => {
            state.sentRequests = [...(state.sentRequests ?? []), action.payload]
        },
        removeSentRequest: (state, action: PayloadAction<string>) => {
            state.sentRequests = state.sentRequests?.filter((item: string) => item !== action.payload)
        },
    }
})

export const { setFriends, setFriendRequests, setSentReqs, sendRequest, removeSentRequest, removeFriend, removeRequest, addFriend } = friends.actions;
export default friends.reducer;