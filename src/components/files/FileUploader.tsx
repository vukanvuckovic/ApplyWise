import { uploadFile } from "@/appwrite/fileActions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud } from "lucide-react";
import { Models } from "node-appwrite";
import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { GlobalUserContext } from "../UserContext";

const FileUploader = ({
  setFiles,
}: {
  setFiles: React.Dispatch<React.SetStateAction<Models.Document[] | undefined>>;
}) => {
  const [uploading, setUploading] = useState(false);
  const currentUser = useContext(GlobalUserContext);
  if (!currentUser) throw new Error("No user");

  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);

      for (const file of acceptedFiles) {
        try {
          const res = await uploadFile(file, currentUser.$id);
          if (res?.status) {
            toast({ title: `${file.name} uploaded.` });
            setFiles((prev) => (prev ? [res.file, ...prev] : [res.file]));
          } else {
            toast({ title: `${file.name} failed to upload.` });
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast({ title: `${file.name} failed to upload.` });
        }
      }

      setUploading(false);
    },
    [currentUser.$id]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <section className="flex flex-col gap-2">
      <div
        className={`flex flex-col gap-2 justify-center items-center h-28 border border-dashed rounded-xl p-4 cursor-pointer transition-colors duration-150 ${
          isDragActive
            ? "border-green-400 bg-green-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadCloud
          size={28}
          color={isDragActive ? "#16a34a" : "#9ca3af"}
        />
        <p className="text-sm text-gray-400 select-none text-center">
          {isDragActive
            ? "Drop files here"
            : "Drag & drop files here, or click to select"}
        </p>
      </div>
      {uploading && (
        <div className="self-center flex flex-row items-center gap-2">
          <span className="text-sm text-gray-500">Uploading</span>
          <Loader2 color="green" size={14} className="animate-spin" />
        </div>
      )}
    </section>
  );
};

export default FileUploader;
