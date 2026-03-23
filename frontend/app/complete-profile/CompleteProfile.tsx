"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/InputField";
import CustomSelect from "../components/CustomSelect";
import { request } from "../apiServices/requests";
import { TokenService } from "../apiServices/token-service";
import {
  getApiErrorMessage,
  useAppMutations,
} from "../apiServices/mutations";
import { useStore } from "../lib/store";

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

const initialFormState: RegisterFormState = {
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
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const { setUser } = useStore();
 

 
  const [form, setForm] = useState<RegisterFormState>(initialFormState);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formValidationError, setFormValiationError] = useState<string | null>(null)
  const { registerMutation, updateOwnProfileMutation } = useAppMutations();

  const requiredFields: (keyof RegisterFormState)[] = [
  "fullName",
  "email",
  "phone",
  "graduationYear",
  "degree",
];

  useEffect(() => {
    

    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";
    const params = new URLSearchParams(hash);
    const token = params.get("token");
    const authError = params.get("error");
    const hasIncompleteProfile =
      params.get("requiresProfileCompletion") === "true" ||
      params.get("isProfileComplete") === "false";

    if (hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    if (authError) {
      setErrorMessage("Google authentication failed. Please try again.");
      return;
    }

    const loadProfile = async () => {
      try {
        if (token) {
          TokenService.setCookie(token);
        }

        setStatusMessage("Loading your profile...");
        const response = await request.getOwnProfile();
        const user = response.data.user;
        setUser(user);

        if (!hasIncompleteProfile && user.isProfileComplete) {
          router.replace(user.role === "admin" ? "/admin" : "/community");
          return;
        }

        setForm((prev) => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
          graduationYear: user.graduationYear || prev.graduationYear,
          degree: user.degree || prev.degree,
          specialization: user.specialization || prev.specialization,
          currentRole: user.currentRole || prev.currentRole,
          company: user.company || prev.company,
          location: user.location || prev.location,
          bio: user.bio || prev.bio,
          consent: Boolean(user.consent),
        }));
        ;
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, "Unable to load your profile."),
        );
      } finally {
        setStatusMessage(null);
      }
    };

    void loadProfile();
  }, [ router, setUser]);

  const updateFormField = (
    field: keyof RegisterFormState,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
  for (const field of requiredFields) {
    const value = form[field];

    if (!value || (typeof value === "string" && value.trim() === "")) {
      return `${field === "graduationYear" ? "graduation year" : field} is required`;
    }
  }

  if (!form.consent) {
    return "You must agree to the consent policy";
  }

  // prevent "Select..." as valid input
  if (form.graduationYear === "Select..." || form.degree === "Select...") {
    return "Please select valid options for graduation year and degree";
  }

  return null;
};
 

  const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const validationError = validateForm();

  if (validationError) {
    setFormValiationError(validationError);
    return; 
  }

    try {
      
        await updateOwnProfileMutation.mutateAsync({
          ...form,
          consent: form.consent,
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            }
        });

        return;
      
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to complete registration."),
      );
    }
  };

 

  const graduationYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: string[] = ["Select..."];

    for (let year = currentYear; year >= 1960; year -= 1) {
      years.push(String(year));
    }

    years.push("Others, please specify");
    return years;
  }, []);

  return (
    <section className="w-full mb-16">
      <div className="w-[90%] mx-auto bg-[#F7E3C8] mt-6 rounded-2xl pt-8 pb-[15em] px-6 text-center">
        <h1 className="mt-[1em] text-lg md:text-4xl font-semibold text-gray-900 mb-3 font-montserrat">
           Complete Your Profile
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Complete your alumni biodata so you can access the full platform.
            
        </p>
      </div>

      <div
        className={`bg-white w-[95%] mx-auto mt-[-13em] shadow-2xl rounded-2xl p-6 lg:w-[70%] md:p-10`}
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
                placeholder={form.graduationYear || "Select..."}
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
                placeholder={form.degree || "Select..."}
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
            {formValidationError && (
          <div
            className={`mb-5 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-200`}
          >
            {formValidationError}
          </div>
        )}

            <div className="flex gap-3 max-md:flex-col-reverse">

                
              

              <button
                type="submit"
                disabled={
                  registerMutation.isPending || updateOwnProfileMutation.isPending
                }
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {registerMutation.isPending? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        
      </div>
    </section>
  );
}
