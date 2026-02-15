"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  className?: string;
  label?: string;
  placeholder?: string; // NEW
  options: string[];
  required?: boolean;
  onChange?: (value: string) => void;
}

export default function CustomSelect({
  className,
  label,
  placeholder = "Select...",
  options,
  required = false,
  onChange,
}: CustomSelectProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    setOpen(false);

    if (opt !== "Others, please specify") {
      setCustomValue("");
      onChange?.(opt);
    } else {
      onChange?.(opt); // let parent know "Others..." was chosen
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange?.(val);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex justify-between items-center rounded-lg px-4 py-3 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${className}`}
      >
        <span className={`${!selected ? "text-gray-400" : "text-gray-700"}`}>
          {selected || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-500 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Options */}
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto"
        >
          {options.map((opt, idx) => (
            <li
              key={idx}
              role="option"
              aria-selected={selected === opt}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selected === opt ? "bg-gray-50 font-medium" : ""
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}

      {/* Custom input for "Others..." */}
      {selected === "Others, please specify" && (
        <input
          type="text"
          placeholder="Please specify"
          value={customValue}
          onChange={handleCustomChange}
          className="mt-2 w-full rounded-lg px-4 py-3 text-gray-700 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          required={required}
        />
      )}
    </div>
  );
}
