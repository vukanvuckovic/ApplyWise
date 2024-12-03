"use client";
import { getFiles } from "@/appwrite/fileActions";
import { Models } from "node-appwrite";
import { Add } from "iconsax-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import FileUploader from "../files/FileUploader";
import FileCard from "../files/FileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobalUserContext } from "../UserContext";

export const FilesContext = createContext<
  | {
      file: Models.Document;
      setFiles: React.Dispatch<React.SetStateAction<Models.Document[] | undefined>>;
    }
  | undefined
>(undefined);

const SkeletonFileCard = () => (
  <div className="flex flex-row items-center justify-between rounded-lg p-2 custom-shadow">
    <div className="flex flex-row items-center gap-2">
      <Skeleton className="h-[45px] aspect-square rounded-md" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  </div>
);

const UploadFiles = () => {
  const [fileUploader, setFileUploader] = useState(false);
  const [files, setFiles] = useState<Models.Document[] | undefined>(undefined);
  const [limit, setLimit] = useState(5);
  const [limitLoading, setLimitLoading] = useState(false);
  const [noMoreFiles, setNoMoreFiles] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const currentUser = useContext(GlobalUserContext);
  if (!currentUser) throw new Error("No user");

  useEffect(() => {
    const fileFunc = async () => {
      const prevFiles = files?.length;

      setFiles(undefined);

      const res = await getFiles(currentUser.$id, limit);

      if (prevFiles === res?.files.length) {
        setNoMoreFiles(true);
      }

      if (res?.files && res.files.length < res.total) {
        setShowLoadMore(true);
      }

      setFiles(res?.files);
      setLimitLoading(false);
    };

    fileFunc();
  }, [limit]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <h3>Uploaded Files</h3>
        <button
          className="group duration-200 flex flex-row items-center gap-1"
          onClick={() => setFileUploader((prev) => !prev)}
        >
          <Add
            size={16}
            color="green"
            className="group-hover:rotate-90 duration-500 ease-out"
          />
          <span className="add-button">Upload</span>
        </button>
      </div>
      {fileUploader && <FileUploader setFiles={setFiles} />}
      <div className="flex flex-col gap-2">
        {files ? (
          files.length > 0 ? (
            <>
              {files.map((item) => (
                <FilesContext.Provider
                  value={{ file: item, setFiles }}
                  key={item.$id}
                >
                  <FileCard key={item.$id} />
                </FilesContext.Provider>
              ))}
              {showLoadMore && (
                <button
                  disabled={noMoreFiles}
                  onClick={() => {
                    setLimitLoading(true);
                    setLimit((prev) => prev + 5);
                  }}
                  className="text-green-600 text-sm self-center py-1 hover:text-green-700 transition-colors duration-150 disabled:text-gray-400"
                >
                  {limitLoading
                    ? "Loading..."
                    : noMoreFiles
                    ? "All files loaded"
                    : "Load More"}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center py-8 gap-1">
              <span className="text-gray-400 text-sm">No uploaded files.</span>
            </div>
          )
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonFileCard key={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default UploadFiles;
