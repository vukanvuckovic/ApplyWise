'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Models } from 'node-appwrite';

interface initialState {
    applications: Models.Document[] | undefined;
}

const initialState: initialState = {
    applications: undefined
}

const applications = createSlice({
    name: "applications",
    initialState,
    reducers: {
        setApplications: (state, action: PayloadAction<Models.Document[] | undefined>) => {
            state.applications = action.payload;
        },
        addApplication: (state, action: PayloadAction<Models.Document>) => {
            state.applications = [action.payload, ...state.applications ?? []]
        },
        exchangeApplications: (state, action: PayloadAction<Models.Document>) => {
            state.applications = state.applications?.map((item: Models.Document) =>
                item.$id === action.payload.$id ? action.payload : item
            );
        },
        deleteApplication: (state, action: PayloadAction<Models.Document>) => {
            state.applications = [...(state.applications ?? []).filter(
                (item: Models.Document) => item.$id !== action.payload.$id
            )]
        }
    }
})

export const { setApplications, addApplication, exchangeApplications, deleteApplication } = applications.actions;
export default applications.reducer;