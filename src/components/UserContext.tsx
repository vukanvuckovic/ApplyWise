"use client"
import { Models } from "node-appwrite";
import React, { createContext } from "react";

export const GlobalUserContext = createContext<Models.Document | undefined>(undefined);

const UserContext = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Models.Document;
}) => {
  return (
    <GlobalUserContext.Provider value={value}>
      {children}
    </GlobalUserContext.Provider>
  );
};

export default UserContext;
