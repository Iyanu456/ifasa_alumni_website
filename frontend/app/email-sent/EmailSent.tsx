"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Pencil, X, CheckCircle, Loader2 } from "lucide-react";
import {
  useAppMutations,
  getApiErrorMessage,
} from "@/app/apiServices/mutations";
import { useStore } from "../lib/store";

export default function EmailSentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useStore();

  const defaultEmail = user?.email || "";
  

  const [email, setEmail] = useState(defaultEmail);
  const [tempEmail, setTempEmail] = useState(email);
  const [cooldown, setCooldown] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"options" | "edit">("options");
  const [emailUpdated, setEmailUpdated] = useState(false);

  const {
    resendVerificationEmailMutation,
    // 👉 add this later when you implement it
    // updateVerificationEmailMutation,
  } = useAppMutations();

  const isResending = resendVerificationEmailMutation.isPending;
  const isResendSuccess = resendVerificationEmailMutation.isSuccess;
  const isResendError = resendVerificationEmailMutation.isError;

  // ⏱ cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    if (!isModalOpen) return;
    setEmailUpdated(false);
  }, [isModalOpen]);

  // 📬 Open mail provider
  const openMail = () => {
    const domain = email.split("@")[1] || "";
    if (domain.includes("gmail")) {
      window.open("https://mail.google.com", "_blank");
    } else if (domain.includes("outlook") || domain.includes("hotmail")) {
      window.open("https://outlook.live.com/mail/", "_blank");
    } else {
      window.open("mailto:", "_blank");
    }
  };

  // 🔁 Resend email
  const handleResend = async () => {
    resendVerificationEmailMutation.reset();

    try {
      await resendVerificationEmailMutation.mutateAsync(email);
      setCooldown(30);
    } catch {}
  };

  return (
    <>
      <div className="h-[90%] grid place-items-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 p-8 shadow-xl text-center">
          {/* Icon */}
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50">
            <Mail size={28} className="text-gray-800" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-yellow-300" />
            <span className="absolute -right-3 top-3 h-1.5 w-1.5 rounded-full bg-yellow-200" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Verify your email
          </h1>

          <p className="mt-2 text-sm text-neutral-600 leading-relaxed py-2">
            We’ve sent a verification email to{" "}
            <span className="font-medium text-neutral-900 break-all">
              {email}
            </span>
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {/* Open Mail */}
            <button
              onClick={openMail}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90"
            >
              Open my mail now
            </button>

            {/* Change Email */}
            {/*<button
              onClick={() => {
                setTempEmail(email);
                setModalStep("edit");
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <Pencil size={14} />
              Change email address
            </button>*/}

            {/* Resend */}
            <button
              disabled={cooldown > 0 || isResending || !email}
              onClick={handleResend}
              className="text-sm text-neutral-600 hover:underline disabled:opacity-50"
            >
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : isResending
                ? "Resending..."
                : "Did not receive? Resend email"}
            </button>

            {/* Success */}
            {isResendSuccess && cooldown > 0 && (
              <p className="text-xs text-emerald-600">
                Verification email sent again.
              </p>
            )}

            {/* Error */}
            {isResendError && (
              <p className="text-xs text-red-600">
                {getApiErrorMessage(
                  resendVerificationEmailMutation.error,
                  "Failed to resend verification email."
                )}
              </p>
            )}
          </div>

          <div className="mt-6 text-xs text-neutral-500">
            Have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-neutral-800 hover:underline"
            >
              Log in
            </button>
          </div>
        </div>
      </div>

      {/* 🪟 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            {/* EDIT STEP */}
            {modalStep === "edit" && (
              <>
                <div className="mb-2 flex justify-between">
                  <h2 className="text-base font-semibold">
                    Update your email
                  </h2>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X />
                  </button>
                </div>

                <p className="mb-4 text-sm text-neutral-500">
                  Enter the correct email address.
                </p>

                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="mb-4 w-full rounded-xl border border-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="you@example.com"
                />

                <div className="flex gap-2">
                  <button
                    disabled={!tempEmail || tempEmail === email}
                    onClick={() => {
                      setEmail(tempEmail);
                      setEmailUpdated(true);
                      setModalStep("options");
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-xl "
                  >
                    Send
                  </button>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border py-2 hover:bg-gray-100 rounded-xl border-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* SUCCESS STEP */}
            {modalStep === "options" && emailUpdated && (
              <>
                <div className="mb-2 flex justify-between">
                  <h2 className="font-semibold">Email updated</h2>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X />
                  </button>
                </div>

                <div className="mb-4 flex gap-2 bg-emerald-50 p-3 text-sm text-emerald-700 rounded-xl">
                  <CheckCircle size={16} />
                  <p>
                    Your email has been updated to{" "}
                    <span className="font-medium">{email}</span>. A new
                    verification email will be sent.
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-black text-white py-2 rounded-xl"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}