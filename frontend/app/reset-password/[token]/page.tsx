"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;
  const { resetPasswordMutation } = useAppMutations();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const response = await resetPasswordMutation.mutateAsync({
      token: token || "",
      password,
    });

    router.push(
      response.data.requiresProfileCompletion ? "/complete-profile" : "/dashboard",
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] pt-[6em]">
      <section className="mx-auto w-[95%] max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="New password"
          />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Confirm new password"
          />
          <button className="w-full rounded-lg bg-primary py-3 font-medium text-white">
            {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message ? <p className="mt-4 text-sm text-red-500">{message}</p> : null}
        {resetPasswordMutation.error ? (
          <p className="mt-4 text-sm text-red-500">
            {getApiErrorMessage(resetPasswordMutation.error, "Unable to reset password.")}
          </p>
        ) : null}
      </section>
    </main>
  );
}
