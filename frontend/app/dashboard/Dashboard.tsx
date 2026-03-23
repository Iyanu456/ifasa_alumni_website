"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/InputField";
import CustomSelect from "../components/CustomSelect";
import {
  useAppMutations,
  getApiErrorMessage,
} from "@/app/apiServices/mutations";
import { useStore } from "@/app/lib/store";
import {
  LogOut,
  User,
  CheckCircle,
  Loader2,
  Camera,
  ArrowLeft,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, logout } = useStore();

  const { updateOwnProfileMutation } = useAppMutations();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    graduationYear: "",
    degree: "",
    location: "",
    bio: "",
    currentRole: "",
    company: "",
    consent: false,
  });

  const [message, setMessage] = useState<string | null>(null);

  // 🖼 Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // populate form
  useEffect(() => {
    if (!user) return;

    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      graduationYear: user.graduationYear || "",
      degree: user.degree || "",
      location: user.location || "",
      bio: user.bio || "",
      currentRole: user.currentRole || "",
      company: user.company || "",
      consent: user.consent || false,
    });
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 🖼 Handle avatar preview
  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const payload = {
        ...form,
        avatar: avatarFile, // ⚠️ ensure backend supports this
      };

      const res = await updateOwnProfileMutation.mutateAsync(payload);
      setUser(res.data.user);
      setMessage("Profile updated successfully ✅");
    } catch (err) {
      setMessage(
        getApiErrorMessage(err, "Failed to update profile")
      );
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0";
    logout();
    router.push("/login");
  };

  const isComplete =
    user?.fullName &&
    user?.phone &&
    user?.graduationYear &&
    user?.degree &&
    user?.consent;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 font-montserrat">
      <div className="max-w-5xl mx-auto space-y-8 max-md:space-y-4">
        
        {/* HEADER */}
        <div className="max-md:flex-col max-md:gap-3 flex md:justify-between md:items-center">
          <div>
            <h1 className="text-lg md:text-3xl font-semibold text-gray-900">
              Welcome, {user?.fullName || "Alumnus"} 👋
            </h1>
            <p className="text-sm text-gray-500">
              Manage your profile and stay connected
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="max-md:w-full max-md:mt-2 max-md:justify-center flex items-center gap-2 text-sm bg-primary text-white px-4 py-3 max-md:py-2.5 rounded-lg hover:bg-primary/95 transition hover:scale-105 max-md:hover:scale-102 ease-in"
            >
              <ArrowLeft size={16} />
              Home
            </button>

            <button
              onClick={handleLogout}
              className="max-md:hidden flex items-center gap-2 text-sm bg-gray-200 px-4 py-3 max-md:py-2.5 rounded-lg text-gray-600 hover:text-red-600 transition hover:scale-105 eas"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* PROFILE STATUS */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle
              className={isComplete ? "text-green-500" : "text-gray-300"}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Profile Status
              </p>
              <p className="text-xs text-gray-500">
                {isComplete
                  ? "Your profile is complete"
                  : "Complete your profile to unlock full access"}
              </p>
            </div>
          </div>

          {!isComplete && (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              Incomplete
            </span>
          )}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 max-md:p-4 border border-gray-200 space-y-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User size={18} /> Profile Information
          </h2>

          {/* 🖼 PROFILE IMAGE */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                {avatarPreview || user?.avatarUrl ? (
                  <Image
                    src={avatarPreview || user?.avatarUrl || ""}
                    width={100}
                    height={100}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:opacity-90">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarChange(file);
                  }}
                />
              </label>
            </div>

            <p className="text-xs text-gray-500">
              Click to upload profile picture
            </p>
          </div>

          {message && (
            <p className="text-sm text-primary">{message}</p>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            

            <InputField
                            label="Full Name"
                            placeholder="Full name"
                            value={form.fullName}
                            onChange={(val) => handleChange("fullName", val)}
                          />

            <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="Phone number"
                 
                  value={form.phone}
                  onChange={(val) => handleChange("phone", val)}
                />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputField
                            label="Current location"
                            placeholder="City, Country"
                            value={form.location}
                            onChange={(val) => handleChange("location", val)}
                          />

            <CustomSelect
                            label="Degree"
                           
                            options={[
                              "Select...",
                              "B.Sc Architecture",
                              "M.Sc Architecture",
                              "M.Arch",
                              "PhD",
                              "Others, please specify",
                            ]}
                            placeholder={form.degree || "Select..."}
                            onChange={(val) => handleChange("degree", val)}
                          />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputField
                            label="Current role / position"
                            placeholder="Your current role"
                            value={form.currentRole}
                            onChange={(val) => handleChange("currentRole", val)}
                          />

            <InputField
                            label="Company / organization"
                            placeholder="Company or organization"
                            value={form.company}
                            onChange={(val) => handleChange("company", val)}
                          />
          </div>

          
          <div className="pt-3">
            <label className="block mb-3 text-sm font-semibold">
                Short bio (what are you currently working on?)
              </label>
              <textarea
            className="input"
            rows={4}
            placeholder="Short bio"
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
          </div>
          

          <button
            type="submit"
            disabled={updateOwnProfileMutation.isPending}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-60 flex justify-center items-center gap-2 transition"
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
              className="max-md:flex hidden items-center gap-2 text-sm bg-gray-200 font-semibold px-4 py-3 max-md:py-2.5 rounded-lg text-gray-600 hover:text-red-600 transition hover:scale-105 ease-in mr-0 ml-auto mt-5 mb-[3em]"
            >
              <LogOut size={16} />
              Logout
            </button>
    </div>
  );
}