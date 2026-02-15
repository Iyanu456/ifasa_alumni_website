"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InputField from "../components/InputField";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const updateField = (field: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    alert("Signed in (frontend only for now)");
  };

  return (
    <section className="w-full mb-16">
      {/* Header */}
      <div className="w-[90%] mx-auto bg-[#F7E3C8] mt-6 rounded-2xl pt-8 pb-[12em] px-6 text-center">
        <div className="w-[95%] lg:w-[80%] mx-auto">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-gray-700 hover:text-black"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to home
          </Link>
        </div>

        <h1 className="mt-[1em] text-lg md:text-4xl font-semibold text-gray-900 mb-3 font-montserrat">
          Sign In
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Welcome back! Sign in to access your alumni profile and community.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white w-[95%] lg:w-[40%] mx-auto mt-[-11em] shadow-2xl rounded-2xl p-6 md:p-8">
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-primary" />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Sign In
          </button>

          <p className="text-sm text-center text-gray-500">
            New here?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Join the alumni network
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
