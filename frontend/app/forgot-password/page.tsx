"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getApiErrorMessage, useAppMutations } from "../apiServices/mutations";

export default function ForgotPasswordPage() {
  const { forgotPasswordMutation } = useAppMutations();
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await forgotPasswordMutation.mutateAsync(email);
    setNotice(
      response.data.previewUrl
        ? `Reset link generated: ${response.data.previewUrl}`
        : "If your account exists, a reset link has been sent to your email.",
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] pt-[6em]">
      <section className="mx-auto w-[95%] max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we&apos;ll send you a secure password reset link.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Email address"
          />
          <button className="w-full rounded-lg bg-primary py-3 font-medium text-white">
            {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {notice ? <p className="mt-4 text-sm text-green-600">{notice}</p> : null}
        {forgotPasswordMutation.error ? (
          <p className="mt-4 text-sm text-red-500">
            {getApiErrorMessage(forgotPasswordMutation.error, "Unable to send reset link.")}
          </p>
        ) : null}
        <Link href="/login" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
