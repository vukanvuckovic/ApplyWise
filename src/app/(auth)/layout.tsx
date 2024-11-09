import { getUser } from "@/appwrite/userActions";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import "@/app/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ApplyWise",
  description: "Track your job application progress.",
  icons: "/logo/applywiselogo.png",
};

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();
  if (user) return redirect("/");

  return (
    <div className="flex max-md:min-h-[100dvh] max-md:justify-center max-md:flex-col flex-row gap-6 w-full max-w-[1140px] 2xl:max-w-[1440px] mx-auto px-6">
      <div className="max-md:order-2 md:w-2/5 flex-shrink-0 h-[30dvh] md:h-[100dvh] md:sticky top-0 rounded-lg py-4">
        <div className="w-full h-full relative rounded-xl overflow-hidden">
          <Image
            src={"/auth/woman-bg-1.jpeg"}
            alt="auth-bg"
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="max-md:order-1 md:w-3/5 flex-shrink-0 flex flex-col gap-6 justify-center md:min-h-[100dvh]">
        <div className="flex flex-row items-center gap-3">
          <div className="h-[50px] w-[50px] rounded-md shadow-sm shadow-gray-200 relative overflow-hidden">
            <Image
              src={"/logo/applywiselogo.png"}
              alt="logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="leading-none">ApplyWise</h2>
            <span className="text-gray-500 font-light text-sm leading-none">
              Keep track of your job applications
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
