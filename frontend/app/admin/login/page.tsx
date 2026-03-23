"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import { TokenService } from "../../apiServices/token-service";
import { request } from "@/app/apiServices/requests";
import {
  getApiErrorMessage,
  useAppMutations,
  
} from "../../apiServices/mutations";
import { useStore } from "../../lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const { loginMutation } = useAppMutations();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const updateField = (field: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await loginMutation.mutateAsync(form);

      if (response.data.user.role !== "admin") {
        TokenService.removeCookie();
        setUser(null);
        setErrorMessage("This account does not have admin access.");
        return;
      }

      router.push("/admin");
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
          Admin Login
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Welcome back! Sign in to access your admin profile.
        </p>
      </div>

      <div className="bg-white w-[95%] lg:w-[40%] mx-auto mt-[-11em] shadow-2xl rounded-2xl p-6 md:p-8">
        {errorMessage && (
          <div className="mb-5 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-200">
            {errorMessage}
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
            className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
          </button>

          <p className="text-sm text-center text-gray-500">
            Not an admin?
            <Link href="/" className="text-primary hover:underline ml-1">
              Go back to the main page
            </Link>
          </p>
        </form>
        
      </div>
    </section>
  );
}
