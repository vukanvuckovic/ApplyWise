import type { Metadata } from "next";
import "@/app/globals.css";
import { getDBUser } from "@/appwrite/userActions";
import { redirect } from "next/navigation";
import UserContext from "@/components/UserContext";

export const metadata: Metadata = {
  title: "ApplyWise",
  description: "Track your job application progress.",
  icons: "/logo/applywiselogo.png",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getDBUser();
  if (!user?.user) return redirect("/sign-in");

  return <UserContext value={user.user}>{children}</UserContext>;
}
