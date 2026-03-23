"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppMutations, getApiErrorMessage } from "@/app/apiServices/mutations"
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const { googleCallbackMutation } = useAppMutations();

  useEffect(() => {
    if (!code || !state|| hasRun.current) return;
    hasRun.current = true;

    googleCallbackMutation.mutate(
  { code, state },
  {
    onSuccess: (response) => {
      const data = response.data;

      const redirectUrl = data.requiresProfileCompletion
        ? "/complete-profile"
        : "/dashboard";

      setTimeout(() => {
        router.replace(redirectUrl);
      }, 1200);
    },
  }
);
  }, [code, state]);

  const isLoading = googleCallbackMutation.isPending;
  const isError = googleCallbackMutation.isError;
  const isSuccess = googleCallbackMutation.isSuccess;
  const status = googleCallbackMutation.status;

  const errorMessage = 
    status === "error"
    ? getApiErrorMessage(
    
    googleCallbackMutation.error,
    "Authentication failed"
  ) : "";

  

  return (
    <div className="h-[90%] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
      
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl p-8 transition-all">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Signing you in
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please wait while we complete authentication
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-4">

          {/* 🔄 LOADING */}
          {isLoading && (
            <>
              <div className="p-3 rounded-full bg-orange-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-sm text-gray-600">
                Verifying your Google account...
              </p>

              {/* subtle progress bar */}
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary animate-pulse w-2/3" />
              </div>
            </>
          )}

          {/* ✅ SUCCESS */}
          {isSuccess && (
            <>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-700 font-medium">
                Authentication successful 🎉
              </p>
              <p className="text-xs text-gray-500">
                Redirecting you now...
              </p>
            </>
          )}

          {/* ❌ ERROR */}
          {isError && (
            <>
              <div className="p-3 rounded-full bg-red-50">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>

              <p className="text-sm text-red-500 text-center font-medium">
                {errorMessage}
              </p>

              <button
                onClick={() => router.replace("/login")}
                className="mt-4 px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 transition text-sm font-medium text-white shadow-sm"
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}