"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/InputField";
import CustomSelect from "../components/CustomSelect";
import { getApiErrorMessage, useAppMutations } from "@/app/apiServices/mutations";
import { buildAvatarFallback } from "../lib/formatters";
import { useStore } from "@/app/lib/store";
import { ArrowLeft, Camera, CheckCircle, Loader2, LogOut, User } from "lucide-react";

type FormState = {
  fullName?: string;
  phone?: string;
  graduationYear?: string;
  degree?: string;
  location?: string;
  bio?: string;
  currentRole?: string;
  company?: string;
  consent?: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, logout } = useStore();
  const { updateOwnProfileMutation } = useAppMutations();
  const [form, setForm] = useState<FormState>({});
  const [message, setMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const currentForm = {
    fullName: form.fullName ?? user?.fullName ?? "",
    phone: form.phone ?? user?.phone ?? "",
    graduationYear: form.graduationYear ?? user?.graduationYear ?? "",
    degree: form.degree ?? user?.degree ?? "",
    location: form.location ?? user?.location ?? "",
    bio: form.bio ?? user?.bio ?? "",
    currentRole: form.currentRole ?? user?.currentRole ?? "",
    company: form.company ?? user?.company ?? "",
    consent: form.consent ?? user?.consent ?? false,
  };

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await updateOwnProfileMutation.mutateAsync({
        ...currentForm,
        avatar: avatarFile,
      });
      setUser(res.data.user);
      setMessage("Profile updated successfully.");
      setForm({});
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Failed to update profile"));
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isComplete =
    user?.fullName && user?.phone && user?.graduationYear && user?.degree && user?.consent;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 font-montserrat">
      <div className="max-w-5xl mx-auto space-y-8 max-md:space-y-4">
        <div className="max-md:flex-col max-md:gap-3 flex md:justify-between md:items-center">
          <div>
            <h1 className="text-lg md:text-3xl font-semibold text-gray-900">
              Welcome, {user?.fullName || "Alumnus"}
            </h1>
            <p className="text-sm text-gray-500">Manage your profile and stay connected</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="max-md:w-full max-md:mt-2 max-md:justify-center flex items-center gap-2 text-sm bg-primary text-white px-4 py-3 rounded-lg"
            >
              <ArrowLeft size={16} />
              Home
            </button>
            <button
              onClick={handleLogout}
              className="max-md:hidden flex items-center gap-2 text-sm bg-gray-200 px-4 py-3 rounded-lg text-gray-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className={isComplete ? "text-green-500" : "text-gray-300"} />
            <div>
              <p className="text-sm font-medium text-gray-900">Profile Status</p>
              <p className="text-xs text-gray-500">
                {isComplete ? "Your profile is complete" : "Complete your profile to unlock full access"}
              </p>
            </div>
          </div>
          {!isComplete ? (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              Incomplete
            </span>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User size={18} /> Profile Information
          </h2>

          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                <Image
                  src={
                    avatarPreview ||
                    user?.avatarUrl ||
                    buildAvatarFallback(user?.fullName || "Alumnus")
                  }
                  width={100}
                  height={100}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:opacity-90">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleAvatarChange(file);
                    }
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">Click to upload profile picture</p>
          </div>

          {message ? <p className="text-sm text-primary">{message}</p> : null}

          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Full Name" placeholder="Full name" value={currentForm.fullName} onChange={(val) => handleChange("fullName", val)} />
            <InputField label="Phone Number" type="tel" placeholder="Phone number" value={currentForm.phone} onChange={(val) => handleChange("phone", val)} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InputField label="Graduation year" placeholder="e.g. 2018" value={currentForm.graduationYear} onChange={(val) => handleChange("graduationYear", val)} />
            <InputField label="Current location" placeholder="City, Country" value={currentForm.location} onChange={(val) => handleChange("location", val)} />
            <CustomSelect
              label="Degree"
              options={["Select...", "B.Sc Architecture", "M.Sc Architecture", "M.Arch", "PhD", "Others, please specify"]}
              placeholder={currentForm.degree || "Select..."}
              onChange={(val) => handleChange("degree", val)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Current role / position" placeholder="Your current role" value={currentForm.currentRole} onChange={(val) => handleChange("currentRole", val)} />
            <InputField label="Company / organization" placeholder="Company or organization" value={currentForm.company} onChange={(val) => handleChange("company", val)} />
          </div>

          <div className="pt-3">
            <label className="block mb-3 text-sm font-semibold">
              Short bio (what are you currently working on?)
            </label>
            <textarea
              className="input"
              rows={4}
              placeholder="Short bio"
              value={currentForm.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={Boolean(currentForm.consent)}
              onChange={(event) => handleChange("consent", event.target.checked)}
              className="mt-1 accent-primary"
            />
            <span>
              I agree to have my information stored for alumni networking and communication purposes.
            </span>
          </label>

          <button
            type="submit"
            disabled={updateOwnProfileMutation.isPending}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium disabled:opacity-60 flex justify-center items-center gap-2 transition"
          >
            {updateOwnProfileMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      <button
        onClick={handleLogout}
        className="max-md:flex hidden items-center gap-2 text-sm bg-gray-200 font-semibold px-4 py-3 rounded-lg text-gray-600 mr-0 ml-auto mt-5 mb-[3em]"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
