"use client";
import { downloadUrl, formatDate } from "@/lib/utils";
import { Models } from "node-appwrite";
import { Download, EllipsisVertical, Folder } from "lucide-react";
import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, Trash } from "iconsax-react";
import { useToast } from "@/hooks/use-toast";
import { deleteFile, updateFile } from "@/appwrite/fileActions";
import { FilesContext } from "../sections/UploadFiles";
import Link from "next/link";
import ConfirmDialog from "../ConfirmDialog";

const EditPopover = ({
  setFilePopoverOpen,
}: {
  setFilePopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const fileContext = useContext(FilesContext);
  if (!fileContext) throw new Error("No Context");
  const { file, setFiles } = fileContext;

  const [editPopoverOpen, setEditPopoverOpen] = useState(false);
  const [fileName, setFileName] = useState(file.name);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEdit = async () => {
    setLoading(true);
    const res = await updateFile(file.$id, fileName);
    if (res?.status) {
      toast({ title: "Success", description: "File renamed." });
      setFiles((prev) =>
        prev?.map((item) =>
          item.$id === file.$id ? { ...item, name: fileName } : item
        )
      );
    } else {
      toast({ title: "Error", description: "Failed to rename file." });
    }
    setLoading(false);
    setEditPopoverOpen(false);
    setFilePopoverOpen(false);
  };

  return (
    <Popover open={editPopoverOpen} onOpenChange={setEditPopoverOpen}>
      <PopoverTrigger className="options-menu-item">
        <Edit size={14} color="green" />
        <span className="text-green-600 text-sm">Edit Name</span>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-3">
        <h3>Edit name</h3>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
          <input
            type="text"
            placeholder="File name"
            className="input-field"
            value={fileName}
            onChange={(e) => setFileName(e.currentTarget.value)}
          />
          <button
            disabled={loading || fileName === file.name}
            type="submit"
            className={`flex-1 px-4 py-1 rounded-md ${
              loading || fileName === file.name
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-sm text-white font-medium transition-colors duration-150`}
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

const FilePopover = () => {
  const [filePopoverOpen, setFilePopoverOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fileContext = useContext(FilesContext);
  if (!fileContext) throw new Error("No Context");
  const { file, setFiles } = fileContext;

  const { toast } = useToast();

  const handleDeleteFile = async () => {
    setDeleteLoading(true);
    const res = await deleteFile(file.$id);
    if (res?.status) {
      toast({ title: "Success", description: "File deleted." });
      setFiles((prev) =>
        prev?.filter((item) => item.$id !== file.$id)
      );
    } else {
      toast({ title: "Failed", description: "File deletion failed." });
    }
    setDeleteLoading(false);
    setFilePopoverOpen(false);
  };

  return (
    <Popover open={filePopoverOpen} onOpenChange={setFilePopoverOpen}>
      <PopoverTrigger className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors duration-100">
        <EllipsisVertical color="gray" size={18} />
      </PopoverTrigger>
      <PopoverContent align="start" side="left" className="p-1 w-fit z-30">
        <ul className="flex flex-col gap-1">
          <li>
            <EditPopover setFilePopoverOpen={setFilePopoverOpen} />
          </li>
          <li>
            <ConfirmDialog
              loading={deleteLoading}
              trigger={
                <>
                  <Trash size={14} color="red" />
                  <span className="text-red-500 text-sm">Delete</span>
                </>
              }
              triggerStyle="options-menu-item"
              title="Are you sure?"
              description="This action cannot be undone. This will permanently delete this file."
              action={handleDeleteFile}
              cancelAction={() => setFilePopoverOpen(false)}
            />
          </li>
          <li>
            <Link
              href={downloadUrl(file.$id)}
              className="options-menu-item"
            >
              <Download color="#3b82f6" size={14} />
              <span className="text-sm text-blue-500">Download</span>
            </Link>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const FileCard = () => {
  const fileContext = useContext(FilesContext);
  if (!fileContext) throw new Error("No Context");
  const { file } = fileContext;

  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-lg p-2 custom-shadow w-full max-w-full overflow-hidden card-hover bg-white">
      <div className="flex items-center gap-2 overflow-hidden w-full">
        <div className="flex-shrink-0 h-[42px] aspect-square rounded-lg bg-green-50 flex justify-center items-center">
          <Folder size={22} color="#16a34a" />
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <h4 className="max-sm:text-sm text-base truncate whitespace-nowrap overflow-hidden w-full leading-snug">
            {file.name}
          </h4>
          <span className="max-sm:text-[10px] text-xs text-gray-400 truncate whitespace-nowrap overflow-hidden w-full">
            {formatDate(file.$createdAt)}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <FilePopover />
      </div>
    </div>
  );
};

export default FileCard;
