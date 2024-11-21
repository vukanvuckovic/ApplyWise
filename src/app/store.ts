'use client'
import { configureStore } from '@reduxjs/toolkit';
import applicationFormReducer from "../features/applicationFormSlice";
import applicationsReducer from "../features/applicationsSlice";
import friendsReducer from "../features/friendsSlice";

export const store = configureStore({
    reducer: {
        applicationForm: applicationFormReducer,
        applications: applicationsReducer,
        friends: friendsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;