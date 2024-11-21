"use client";
import { createRecovery } from "@/appwrite/userActions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Recovery = () => {
  const [userData, setUserData] = useState({
    email: "",
  });
  const [baseUrl, setBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
      setLoading(false);
    }
  }, []);

  const { toast } = useToast();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await createRecovery(
          userData.email,
          `${baseUrl}/recovery/confirmation`
        );
        if (res?.status) {
          toast({
            title: "Check your email.",
            description: "Follow the link in your email to complete recovery.",
          });
        } else {
          toast({
            title: "No such user found",
            description: "Try again.",
          });
        }
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <label
          className="custom-label"
          htmlFor="email"
        >
          Email
        </label>
        <input
          required
          name="email"
          type="email"
          placeholder="Enter recovery email"
          className="input-field font-light"
          value={userData.email}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>
      <button
        disabled={loading}
        className="bg-green-700 text-white py-2 rounded-md text-sm font-normal"
      >
        Start Recovery
      </button>
      <Link
        href={"/sign-in"}
        className="self-end text-xs font-light text-gray-500"
      >
        Back to <span className="text-green-600 font-medium">Sign In.</span>
      </Link>
    </form>
  );
};

export default Recovery;
