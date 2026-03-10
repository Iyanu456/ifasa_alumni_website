"use client";

import React from "react";

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
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg px-4 py-3 border border-gray-300 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      />
    </div>
  );
}
