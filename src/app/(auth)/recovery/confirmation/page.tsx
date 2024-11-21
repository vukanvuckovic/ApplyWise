"use client";
import { confirmRecovery } from "@/appwrite/userActions";
import { useToast } from "@/hooks/use-toast";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Recovery = () => {
  const seachParams = useSearchParams();
  const userId = seachParams.get("userId");
  const secret = seachParams.get("secret");

  const [userData, setUserData] = useState({
    password: "",
  });
  const { toast } = useToast();

  if (!userId || !secret) return redirect("/sign-in");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await confirmRecovery(userId!, secret!, userData.password);
        if (res?.status) {
          toast({
            title: "Recovery Successful!",
            description: "New Password has been set.",
          });
          return redirect("/sign-in");
        } else {
          toast({
            title: "Recovery Failed!",
          });
          return redirect("/sign-in");
        }
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <label
          className="custom-label"
          htmlFor="secret"
        >
          New Password
        </label>
        <input
          required
          name="secret"
          type="password"
          placeholder="Choose your new password"
          className="input-field"
          value={userData.password}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, password: e.target.value }))
          }
        />
      </div>
      <button className="bg-green-700 text-white py-2 rounded-md">
        Reset Password
      </button>
    </form>
  );
};

export default Recovery;
