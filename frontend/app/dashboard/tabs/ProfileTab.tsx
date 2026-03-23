"use client";

import { useEffect, useState } from "react";
import { useAppMutations, getApiErrorMessage } from "@/app/apiServices/mutations";
import { useStore } from "@/app/lib/store";
import { Loader2 } from "lucide-react";

export default function ProfileTab() {
  const { user, setUser } = useStore();
  const { updateOwnProfileMutation } = useAppMutations();

  const [form, setForm] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm(user);
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await updateOwnProfileMutation.mutateAsync(form);
      setUser(res.data.user);
      setMessage("Profile updated successfully ✅");
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Update failed"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl border space-y-4"
    >
      <h2 className="text-lg font-semibold">Profile Information</h2>

      {message && <p className="text-sm text-primary">{message}</p>}

      <input
        className="input"
        value={form.fullName || ""}
        onChange={(e) =>
          setForm({ ...form, fullName: e.target.value })
        }
        placeholder="Full Name"
      />

      <input
        className="input"
        value={form.phone || ""}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
        placeholder="Phone"
      />

      <button
        className="bg-primary text-white py-3 rounded-xl w-full flex justify-center items-center gap-2"
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
  );
}