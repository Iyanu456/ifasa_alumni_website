"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputFieldProps = {
  label: string;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  required = false,
  onChange,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg px-4 py-3 pr-12 border border-gray-300 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />

        {/* 👁️ Toggle button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}