"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "@/app/apiServices/mutations";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const router = useRouter();
  const { verifyEmailMutation } = useAppMutations();

  useEffect(() => {
    if (!token) return;

    const normalizedToken = Array.isArray(token) ? token[0] : token;

    verifyEmailMutation.mutate(normalizedToken, {
      onSuccess: (response) => {
        const user = response.data.user;

        router.replace(user.isProfileComplete ? "/" : "/complete-profile");
      },
    });
  }, [router, token, verifyEmailMutation]);

  const status = verifyEmailMutation.status;
  const message =
    status === "error"
      ? getApiErrorMessage(verifyEmailMutation.error, "Verification failed")
      : "Your email has been successfully verified.";

  return (
    <div className="flex h-[90%] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          {status === "pending" && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
          {status === "success" && (
            <CheckCircle className="h-12 w-12 text-green-500" />
          )}
          {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          {status === "pending" && "Verifying your email..."}
          {status === "success" && "Email Verified"}
          {status === "error" && "Verification Failed"}
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          {status === "pending"
            ? "Please wait while we confirm your email."
            : message}
        </p>

        {status !== "pending" && (
          <button
            disabled
            className="w-full rounded-lg bg-primary py-2.5 font-medium text-white shadow-sm transition-colors"
          >
            Redirecting...
          </button>
        )}
      </div>
    </div>
  );
}
