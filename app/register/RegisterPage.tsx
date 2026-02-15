"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InputField from "../components/InputField";
import CustomSelect from "../components/CustomSelect";

type RegisterFormState = {
  fullName: string;
  email: string;
  phone: string;
  graduationYear: string;
  degree: string;
  specialization: string;
  currentRole: string;
  company: string;
  location: string;
  bio: string;
  consent: boolean;
};

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 (Auth)
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });

  // Step 2 (Biodata)
  const [form, setForm] = useState<RegisterFormState>({
    fullName: "",
    email: "",
    phone: "",
    graduationYear: "",
    degree: "",
    specialization: "",
    currentRole: "",
    company: "",
    location: "",
    bio: "",
    consent: false,
  });

  const updateFormField = (
    field: keyof RegisterFormState,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAuthSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend-only validation for now
    if (!auth.email || !auth.password) return;

    // Autofill email into biodata form
    setForm((prev) => ({ ...prev, email: auth.email }));

    // Move to step 2
    setStep(2);
  };

  const handleFinalSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ auth, form });
    alert("Registration submitted! (Frontend only for now)");
  };

  function generateGraduationYears(startYear: number = 1960) {
    const currentYear = new Date().getFullYear();
    const years: string[] = ["Select..."];
    for (let y = currentYear; y >= startYear; y--) years.push(String(y));
    years.push("Others, please specify");
    return years;
  }

  const graduationYearOptions = generateGraduationYears(1960);

  return (
    <section className="w-full mb-16">
      {/* Header */}
      <div className="w-[90%] mx-auto bg-[#F7E3C8] mt-6 rounded-2xl pt-8 pb-[15em] px-6 text-center">
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
          Join the Alumni Network
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Help us build a strong alumni community. Create your account and share
          your details.
        </p>
      </div>

      {/* Card */}
      <div className={`bg-white w-[95%]  mx-auto mt-[-13em] shadow-2xl rounded-2xl p-6  ${step === 1 ? "md:w-[60%] lg:w-[40%] md:p-8" : "lg:w-[70%] md:p-10" }`}>
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8 text-sm text-gray-500">
          <span className={step === 1 ? "text-primary font-medium" : ""}>
            Step 1: Account
          </span>
          <span>→</span>
          <span className={step === 2 ? "text-primary font-medium" : ""}>
            Step 2: Biodata
          </span>
        </div>

        {/* STEP 1: Auth */}
        {step === 1 && (
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <InputField
              label="Email"
              type="email"
              placeholder="Email address"
              value={auth.email}
              required
              onChange={(val) => setAuth((p) => ({ ...p, email: val }))}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Create a password"
              value={auth.password}
              required
              onChange={(val) => setAuth((p) => ({ ...p, password: val }))}
            />

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Continue
            </button>

            <p className="text-sm text-center text-gray-500">
              Already registered?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in instead
              </Link>
            </p>
          </form>
        )}

        {/* STEP 2: Biodata */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                placeholder="Full name"
                value={form.fullName}
                required
                onChange={(val) => updateFormField("fullName", val)}
              />

              <InputField
                label="Email"
                type="email"
                value={form.email}
                required
                onChange={(val) => updateFormField("email", val)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Phone Number"
                type="tel"
                placeholder="Phone number"
                required
                value={form.phone}
                onChange={(val) => updateFormField("phone", val)}
              />

              <InputField
                label="Current location"
                placeholder="City, Country"
                value={form.location}
                onChange={(val) => updateFormField("location", val)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CustomSelect
                label="Graduation Year"
                required
                options={graduationYearOptions}
                onChange={(val) => updateFormField("graduationYear", val)}
              />

              <CustomSelect
                label="Degree"
                required
                options={[
                  "Select...",
                  "B.Sc Architecture",
                  "M.Sc Architecture",
                  "M.Arch",
                  "PhD",
                  "Others, please specify",
                ]}
                onChange={(val) => updateFormField("degree", val)}
              />

              <InputField
                label="Specialization"
                placeholder="Specialization (optional)"
                value={form.specialization}
                onChange={(val) => updateFormField("specialization", val)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Current role / position"
                placeholder="Your current role"
                value={form.currentRole}
                onChange={(val) => updateFormField("currentRole", val)}
              />

              <InputField
                label="Company / organization"
                placeholder="Company or organization"
                value={form.company}
                onChange={(val) => updateFormField("company", val)}
              />
            </div>

            <div>
              <label className="block mb-4 text-sm font-medium">
                Short bio (what are you currently working on?)
              </label>
              <textarea
                rows={5}
                placeholder="Tell us a bit about yourself"
                value={form.bio}
                onChange={(e) => updateFormField("bio", e.target.value)}
                className="rounded-lg px-4 py-3 bg-[#FAFAFA] w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => updateFormField("consent", e.target.checked)}
                className="mt-1 accent-primary"
                required
              />
              <span>
                I agree to have my information stored for alumni networking and
                communication purposes.
              </span>
            </label>

            <div className="flex gap-3 max-md:flex-col-reverse">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                Complete Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
