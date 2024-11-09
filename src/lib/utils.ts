import { appwriteConfig } from "@/appwrite/appwriteConfig";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = isCurrentYear ? "" : `, ${date.getFullYear()}`;

  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = date.getHours() >= 12 ? "pm" : "am";

  return `${day}. ${month}${year} at ${hours}:${minutes}${period}`;
};

export const downloadUrl = (fileId: string) => {
  const baseUrl = appwriteConfig.endpoint;
  const bucketId = appwriteConfig.bucketId;

  return `${baseUrl}/storage/buckets/${bucketId}/files/${fileId}/download?project=${appwriteConfig.projectId}`;
};