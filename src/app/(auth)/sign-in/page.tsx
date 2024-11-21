"use client";
import { logInUser } from "@/appwrite/userActions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | undefined>();

  const { toast } = useToast();
  const router = useRouter();

  return (
    <>
      <form
        className="flex flex-col gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(undefined);
          const res = await logInUser(userData.email, userData.password);
          if (res?.status) {
            toast({ title: "Welcome back!" });
            router.push("/");
          } else {
            setError("Incorrect email or password. Please try again.");
          }
          setLoading(false);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="custom-label" htmlFor="email">
            Email
          </label>
          <input
            required
            name="email"
            type="email"
            placeholder="Enter your email address"
            className="input-field"
            value={userData.email}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="custom-label" htmlFor="password">
            Password
          </label>
          <input
            required
            name="password"
            type="password"
            placeholder="Your password"
            className="input-field"
            value={userData.password}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <span className="font-light text-gray-500 text-xs self-end">
            Forgotten password?{" "}
            <Link href="/recovery" className="text-green-600 font-normal">
              Start recovery.
            </Link>
          </span>
        </div>
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          disabled={loading}
          className="flex justify-center items-center gap-2 bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <>
              Signing in
              <Loader2 size={16} color="white" className="animate-spin" />
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      <span className="font-light text-gray-500 text-sm self-center">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-green-600 font-normal">
          Sign Up.
        </Link>
      </span>
    </>
  );
};

export default SignIn;
