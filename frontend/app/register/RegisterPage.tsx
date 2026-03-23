"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "../components/InputField";
import { request } from "../apiServices/requests";
import { getApiErrorMessage, useAppMutations } from "../apiServices/mutations";

export default function RegisterPage() {
  const router = useRouter();
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { registerMutation } = useAppMutations();

  const handleAuthSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!auth.email || !auth.password) {
      return;
    }

    registerMutation.mutate(
      {
        email: auth.email,
        password: auth.password,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.replace("/email-sent");
          }, 1200);
        },
      },
    );
  };

  const handleGoogleRegister = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsGoogleLoading(true);

    try {
      const response = await request.getGoogleAuthUrl(
        `${window.location.origin}/register?mode=complete-profile`,
      );
      window.location.href = response.data.url;
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to start Google registration."),
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="w-full mb-16">
      <div className="w-[90%] mx-auto bg-[#F7E3C8] mt-6 rounded-2xl pt-8 pb-[15em] px-6 text-center">
        <h1 className="mt-[1em] text-lg md:text-4xl font-semibold text-gray-900 mb-3 font-montserrat">
          Join the Alumni Network
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Help us build a strong alumni community. Create your account and share your details.
        </p>
      </div>

      <div
        className={`bg-white w-[95%] mx-auto mt-[-13em] shadow-2xl rounded-2xl p-6
        md:w-[60%] lg:w-[40%] md:p-8`}
      >
        {(statusMessage || errorMessage) && (
          <div
            className={`mb-5 rounded-lg px-4 py-3 text-sm ${
              errorMessage
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {errorMessage || statusMessage}
          </div>
        )}

       

        
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <InputField
              label="Email"
              type="email"
              placeholder="Email address"
              value={auth.email}
              required
              onChange={(val) => setAuth((prev) => ({ ...prev, email: val }))}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Create a password"
              value={auth.password}
              required
              onChange={(val) =>
                setAuth((prev) => ({ ...prev, password: val }))
              }
            />

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              {registerMutation.isPending ? "Submitting..." : "Continue"}
            </button>

            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isGoogleLoading}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-60"
            >
              {isGoogleLoading
                ? "Redirecting to Google..."
                : "Continue with Google"}
            </button>

            <p className="text-sm text-center text-gray-500">
              Already registered?
              <Link href="/login" className="text-primary hover:underline ml-1">
                Sign in instead
              </Link>
            </p>
          </form>
        
      </div>
    </section>
  );
}
