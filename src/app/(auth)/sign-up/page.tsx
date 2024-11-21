"use client";
import { createUser } from "@/appwrite/userActions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FormErrors {
  password?: string;
  general?: string;
}

const SignUp = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    profession: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();
  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (userData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <form
        className="flex flex-col gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!validate()) return;
          setLoading(true);
          setErrors({});
          const res = await createUser(userData);
          if (res?.status) {
            toast({ title: "Account created!" });
            router.push("/");
          } else {
            setErrors({ general: "Failed to create account. The email may already be in use." });
          }
          setLoading(false);
        }}
      >
        <div className="flex flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="custom-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              required
              name="fullName"
              type="text"
              placeholder="Your full name"
              className="input-field"
              value={userData.fullName}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, fullName: e.target.value }))
              }
            />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="custom-label" htmlFor="profession">
              Profession
            </label>
            <input
              required
              name="profession"
              type="text"
              placeholder="e.g. Frontend Dev"
              className="input-field"
              value={userData.profession}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, profession: e.target.value }))
              }
            />
          </div>
        </div>
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
            placeholder="At least 8 characters"
            className={`input-field ${errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
            value={userData.password}
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, password: e.target.value }));
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
          />
          {errors.password && (
            <span className="text-xs text-red-500 ml-1">{errors.password}</span>
          )}
        </div>
        {errors.general && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errors.general}
          </p>
        )}
        <button
          disabled={loading}
          className="flex justify-center items-center gap-2 bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <>
              Creating account
              <Loader2 size={16} color="white" className="animate-spin" />
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <span className="font-light text-gray-500 text-sm self-center">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-green-600 font-normal">
          Sign In.
        </Link>
      </span>
    </>
  );
};

export default SignUp;
