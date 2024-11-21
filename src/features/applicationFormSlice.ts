'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Models } from 'node-appwrite';

interface initialState {
    formOpen: boolean;
    application?: Models.Document;
}

const initialState: initialState = {
    formOpen: false,
}

const applicationForm = createSlice({
    name: "applicationForm",
    initialState,
    reducers: {
        setForm: (state, action: PayloadAction<boolean>) => {
            state.formOpen = action.payload;
            state.application = undefined;
        },
        setEditForm: (state, action: PayloadAction<{ open: boolean, application: Models.Document }>) => {
            state.application = action.payload.application;
            state.formOpen = action.payload.open;
        },
    }
})

export const { setForm, setEditForm } = applicationForm.actions;
export default applicationForm.reducer;