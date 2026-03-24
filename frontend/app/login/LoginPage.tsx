"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "../components/InputField";
import { request } from "../apiServices/requests";
import { TokenService } from "../apiServices/token-service";
import {
  getApiErrorMessage,
  useAppMutations,
} from "../apiServices/mutations";
import { useStore } from "../lib/store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loginMutation } = useAppMutations();

  const verifiedMessage = useMemo(() => {
    if (searchParams.get("verified") === "true") {
      return "Email verified successfully. You can now sign in.";
    }

    if (searchParams.get("registered") === "true") {
      return "Registration successful. Check your email to verify your account.";
    }

    return null;
  }, [searchParams]);

  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    const token = params.get("token");
    const hasIncompleteProfile =
      params.get("requiresProfileCompletion") === "true" ||
      params.get("isProfileComplete") === "false";
    const authError = params.get("error");

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );

    if (authError) {
      setErrorMessage("Google authentication failed. Please try again.");
      return;
    }

    if (!token) {
      return;
    }

    const completeGoogleLogin = async () => {
      try {
        setStatusMessage("Signing you in with Google...");
        TokenService.setCookie(token);
        const profileResponse = await request.getOwnProfile();
        const user = profileResponse.data.user;
        setUser(user);

        if (hasIncompleteProfile) {
          router.replace("/register?mode=complete-profile");
          return;
        }

        router.replace(user.role === "admin" ? "/admin" : "/community");
      } catch (error) {
        TokenService.removeCookie();
        setErrorMessage(
          getApiErrorMessage(error, "Unable to complete Google sign-in."),
        );
      } finally {
        setStatusMessage(null);
      }
    };

    void completeGoogleLogin();
  }, [router, setUser]);

  const updateField = (field: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await loginMutation.mutateAsync(form);

      if (response.data.requiresProfileCompletion) {
        router.push("/complete-profile");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to sign in."));
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsGoogleLoading(true);

    try {
      const response = await request.getGoogleAuthUrl(
        `${window.location.origin}/login`,
      );
      window.location.href = response.data.url;
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to start Google authentication."),
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="w-full mb-16">
      <div className="w-[90%] mx-auto bg-[#F7E3C8] mt-6 rounded-2xl pt-8 pb-[12em] px-6 text-center">
        <h1 className="mt-[1em] text-lg md:text-4xl font-semibold text-gray-900 mb-3 font-montserrat">
          Sign In
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Welcome back! Sign in to access your alumni profile and community.
        </p>
      </div>

      <div className="bg-white w-[95%] lg:w-[40%] mx-auto mt-[-11em] shadow-2xl rounded-2xl p-6 md:p-8">
        {(verifiedMessage || statusMessage || errorMessage) && (
          <div
            className={`mb-5 rounded-lg px-4 py-3 text-sm ${
              errorMessage
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {errorMessage || statusMessage || verifiedMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            type="email"
            placeholder="Email address"
            value={form.email}
            required
            onChange={(val) => updateField("email", val)}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Your password"
            value={form.password}
            required
            onChange={(val) => updateField("password", val)}
          />

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </button>

          <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading}
                      className="flex justify-center gap-1 w-full border items-center border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-60"
                    >
                      <Image src={"/google.svg"} alt="icon" height={22} width={22} /> {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"} 
                    </button>

          <p className="text-sm text-center text-gray-500">
            New here?
            <Link href="/register" className="text-primary hover:underline ml-1">
              Join the alumni network
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
