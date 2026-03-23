"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAppMutations, getApiErrorMessage } from "@/app/apiServices/mutations";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const router = useRouter();

  const { verifyEmailMutation } = useAppMutations();

  useEffect(() => {
    if (!token) return;

    const normalizedToken = Array.isArray(token) ? token[0] : token;

    verifyEmailMutation.mutate(normalizedToken);
  }, [token]);

  const status = verifyEmailMutation.status;

  const message =
    status === "error"
      ? getApiErrorMessage(
          verifyEmailMutation.error,
          "Verification failed"
        )
      : "Your email has been successfully verified 🎉";

  return (
    <div className="h-[90%] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-lg text-center">
        
        {/* ICON */}
        <div className="flex justify-center mb-6">
          {status === "pending" && (
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          )}
          {status === "success" && (
            <CheckCircle className="w-12 h-12 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {status === "pending" && "Verifying your email..."}
          {status === "success" && "Email Verified"}
          {status === "error" && "Verification Failed"}
        </h1>

        {/* MESSAGE */}
        <p className="text-sm text-gray-600 mb-6">
          {status === "pending" &&
            "Please wait while we confirm your email."}
          {status !== "pending" && message}
        </p>

        {/* ACTION BUTTON */}
        {status !== "pending" && (
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-primary hover:bg-primary/90 transition-colors text-white py-2.5 rounded-lg font-medium shadow-sm"
          >
            Go to Login
          </button>
        )}

        {/* RESEND OPTION */}
        {status === "error" && (
          <button
            onClick={() => router.push("/resend-verification")}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Resend verification email
          </button>
        )}
      </div>
    </div>
  );
}