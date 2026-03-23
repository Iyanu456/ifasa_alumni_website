"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MoreVertical, Plus, Search, X } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";
import { useAdminUsersQuery } from "../../apiServices/queries";
import { buildAvatarFallback } from "../../lib/formatters";
import type { AdminAlumniFormBody, User } from "../../types/types";
import { truncateText } from "../../lib/formatters";

type EditFormState = AdminAlumniFormBody & {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  degree: string;
  currentRole: string;
  company: string;
  location: string;
  graduationYear: string;
  status: "pending" | "approved";
  consent: boolean;
};

const initialFormState: EditFormState = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  degree: "",
  currentRole: "",
  company: "",
  location: "",
  graduationYear: "",
  status: "approved",
  specialization: "",
  bio: "",
  associationRoleTitle: "",
  spotlightQuote: "",
  isMentorAvailable: false,
  isSpotlight: false,
  consent: true,
};

const buildEditState = (user: User): EditFormState => ({
  fullName: user.fullName || "",
  email: user.email || "",
  password: "",
  phone: user.phone || "",
  degree: user.degree || "",
  currentRole: user.currentRole || "",
  company: user.company || "",
  location: user.location || "",
  graduationYear: user.graduationYear || "",
  status: user.status,
  specialization: user.specialization || "",
  bio: user.bio || "",
  associationRoleTitle: user.associationRoleTitle || "",
  spotlightQuote: user.spotlightQuote || "",
  isMentorAvailable: user.isMentorAvailable || false,
  isSpotlight: user.isSpotlight || false,
  consent: user.consent ?? true,
});

export default function AlumniTab() {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const usersQuery = useAdminUsersQuery({ search, limit: 50 });
  const {
    approveAlumnusMutation,
    createAlumnusMutation,
    updateAlumnusMutation,
    deleteAlumnusMutation,
    makeAdminMutation,
    removeAdminMutation,
  } = useAppMutations();

  const users = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data]);
  const isSubmitting =
    approveAlumnusMutation.isPending ||
    createAlumnusMutation.isPending ||
    updateAlumnusMutation.isPending ||
    deleteAlumnusMutation.isPending ||
    makeAdminMutation.isPending ||
    removeAdminMutation.isPending;

  const openCreateModal = () => {
    setEditingUser(null);
    setEditForm(initialFormState);
    setActiveMenu(null);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm(buildEditState(user));
    setActiveMenu(null);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm(null);
  };

  const handleApprove = async (user: User) => {
    setActiveMenu(null);
    await approveAlumnusMutation.mutateAsync(user._id);
  };

  const handleDelete = async (user: User) => {
    setActiveMenu(null);

    if (typeof window !== "undefined") {
      const confirmed = window.confirm(`Delete ${user.fullName}'s account?`);
      if (!confirmed) {
        return;
      }
    }

    await deleteAlumnusMutation.mutateAsync(user._id);
  };

  const handleRoleToggle = async (user: User) => {
    setActiveMenu(null);

    if (user.role === "admin") {
      await removeAdminMutation.mutateAsync(user._id);
      return;
    }

    await makeAdminMutation.mutateAsync(user._id);
  };

  const handleEditSubmit = async () => {
    if (!editForm) {
      return;
    }

    if (!editingUser) {
      await createAlumnusMutation.mutateAsync({
        fullName: editForm.fullName,
        email: editForm.email,
        password: editForm.password,
        phone: editForm.phone,
        degree: editForm.degree,
        graduationYear: editForm.graduationYear,
        currentRole: editForm.currentRole,
        company: editForm.company,
        location: editForm.location,
        status: editForm.status,
        specialization: editForm.specialization,
        bio: editForm.bio,
        associationRoleTitle: editForm.associationRoleTitle,
        spotlightQuote: editForm.spotlightQuote,
        isMentorAvailable: editForm.isMentorAvailable,
        isSpotlight: editForm.isSpotlight,
        consent: editForm.consent,
      });
      closeEditModal();
      return;
    }

    await updateAlumnusMutation.mutateAsync({
      id: editingUser._id,
      data: {
        fullName: editForm.fullName,
        phone: editForm.phone,
        degree: editForm.degree,
        currentRole: editForm.currentRole,
        company: editForm.company,
        location: editForm.location,
        graduationYear: editForm.graduationYear,
        status: editForm.status,
        specialization: editForm.specialization,
        bio: editForm.bio,
        associationRoleTitle: editForm.associationRoleTitle,
        spotlightQuote: editForm.spotlightQuote,
        isMentorAvailable: editForm.isMentorAvailable,
        isSpotlight: editForm.isSpotlight,
      },
    });

    closeEditModal();
  };

  const mutationError =
    approveAlumnusMutation.error ||
    createAlumnusMutation.error ||
    updateAlumnusMutation.error ||
    deleteAlumnusMutation.error ||
    makeAdminMutation.error ||
    removeAdminMutation.error;

    

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
          <p className="text-sm text-gray-500">
            Review registrations, update alumni records, and manage admin access.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white"
        >
          <Plus size={16} />
          Add Alumni
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name, email, role, or company..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full text-sm outline-none"
        />
      </div>

      {mutationError ? (
        <p className="text-sm text-red-500">
          {getApiErrorMessage(mutationError, "We could not update this user right now.")}
        </p>
      ) : null}

      <div className="overflow-hidden  rounded-xl border border-gray-100 bg-white">
        {usersQuery.isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading users...</div>
        ) : usersQuery.error ? (
          <div className="p-8 text-center text-sm text-red-500">
            We could not load the user list.
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No users matched your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm mb-[4em]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4 text-left font-medium">User</th>
                  <th className="hidden p-4 text-left font-medium md:table-cell">Year</th>
                  <th className="hidden p-4 text-left font-medium lg:table-cell">
                    Location
                  </th>
                  <th className="hidden p-4 text-left font-medium lg:table-cell">Role</th>
                  {/*<th className="hidden p-4 text-left font-medium">Status</th>*/}
                  <th className="p-4 text-left font-medium">Access</th>
                  <th className="p-4 text-right font-medium" />
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const avatar = user.avatarUrl || buildAvatarFallback(user.fullName);

                  return (
                    <tr
                      key={user._id}
                      className="border-t border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={avatar}
                            alt={user.fullName}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized
                          />

                          <div>
                            <p className="font-medium max-md:hidden block">{user.fullName}</p>
                            <p className="font-medium max-md:block hidden">{truncateText(user.fullName??"", 14)}</p>
                            <p className="text-xs text-gray-500 block max-md:hidden">{user.email}</p>
                            <p className="text-xs text-gray-500 ">{truncateText(user.email??"", 15) }</p>
                            <p className="text-xs text-gray-400 md:hidden">
                              {user.location || "No location set"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="hidden p-4 md:table-cell">
                        {user.graduationYear || "—"}
                      </td>
                      <td className="hidden p-4 lg:table-cell">
                        {user.location || "—"}
                      </td>
                      <td className="hidden p-4 lg:table-cell">
                        {user.currentRole || user.associationRoleTitle || "—"}
                      </td>
                      {/*<td className="p-4">
                        <span
                          className={`hidden rounded-full px-2 py-1 text-xs ${
                            user.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.status === "approved" ? "Approved" : "Pending"}
                        </span>
                      </td>*/}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            user.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="relative p-4 text-right">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveMenu((current) =>
                              current === user._id ? null : user._id,
                            );
                          }}
                          className="rounded p-2 hover:bg-gray-100"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenu === user._id ? (
                          <div className="absolute right-4 z-4000 mt-2 w-44 rounded-lg border border-gray-100 bg-white text-sm shadow-lg">
                            {user.status === "pending" && user.role !== "admin" ? (
                              <button
                                onClick={() => void handleApprove(user)}
                                disabled={isSubmitting}
                                className="block w-full px-4 py-2 text-left text-green-600 hover:bg-gray-50 disabled:opacity-60"
                              >
                                Approve
                              </button>
                            ) : null}

                            {user.role !== "admin" ? (
                              <button
                                onClick={() => openEditModal(user)}
                                disabled={isSubmitting}
                                className="block w-full px-4 py-2 text-left hover:bg-gray-50 disabled:opacity-60"
                              >
                                Edit
                              </button>
                            ) : null}

                            <button
                              onClick={() => void handleRoleToggle(user)}
                              disabled={isSubmitting}
                              className="block w-full px-4 py-2 text-left hover:bg-gray-50 disabled:opacity-60"
                            >
                              {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                            </button>

                            {user.role !== "admin" ? (
                              <button
                                onClick={() => void handleDelete(user)}
                                disabled={isSubmitting}
                                className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-50 disabled:opacity-60"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editForm ? (
        <div className="fixed inset-0 z-[2600] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingUser ? "Edit Alumni Profile" : "Create Alumni Record"}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingUser ? editingUser.email : "Create a managed alumni account."}
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
              {!editingUser ? (
                <>
                  <input
                    value={editForm.email}
                    onChange={(event) =>
                      setEditForm((current) =>
                        current ? { ...current, email: event.target.value } : current,
                      )
                    }
                    placeholder="Email address"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(event) =>
                      setEditForm((current) =>
                        current ? { ...current, password: event.target.value } : current,
                      )
                    }
                    placeholder="Temporary password"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </>
              ) : null}
              <input
                value={editForm.fullName}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, fullName: event.target.value } : current,
                  )
                }
                placeholder="Full name"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={editForm.graduationYear}
                onChange={(event) =>
                  setEditForm((current) =>
                    current
                      ? { ...current, graduationYear: event.target.value }
                      : current,
                  )
                }
                placeholder="Graduation year"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={editForm.phone}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, phone: event.target.value } : current,
                  )
                }
                placeholder="Phone number"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={editForm.degree}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, degree: event.target.value } : current,
                  )
                }
                placeholder="Degree"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={editForm.currentRole}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, currentRole: event.target.value } : current,
                  )
                }
                placeholder="Current role"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={editForm.company}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, company: event.target.value } : current,
                  )
                }
                placeholder="Company"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={editForm.location}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, location: event.target.value } : current,
                  )
                }
                placeholder="Location"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={editForm.specialization || ""}
                onChange={(event) =>
                  setEditForm((current) =>
                    current
                      ? { ...current, specialization: event.target.value }
                      : current,
                  )
                }
                placeholder="Specialization"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={editForm.associationRoleTitle || ""}
                onChange={(event) =>
                  setEditForm((current) =>
                    current
                      ? { ...current, associationRoleTitle: event.target.value }
                      : current,
                  )
                }
                placeholder="Association title"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <select
                value={editForm.status}
                onChange={(event) =>
                  setEditForm((current) =>
                    current
                      ? {
                          ...current,
                          status: event.target.value as EditFormState["status"],
                        }
                      : current,
                  )
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
              <textarea
                rows={3}
                value={editForm.bio || ""}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, bio: event.target.value } : current,
                  )
                }
                placeholder="Short bio"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 md:col-span-2"
              />
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.consent)}
                    onChange={(event) =>
                      setEditForm((current) =>
                        current ? { ...current, consent: event.target.checked } : current,
                      )
                    }
                  />
                  Consent received
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.isMentorAvailable)}
                    onChange={(event) =>
                      setEditForm((current) =>
                        current
                          ? { ...current, isMentorAvailable: event.target.checked }
                          : current,
                      )
                    }
                  />
                  Available as mentor
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.isSpotlight)}
                    onChange={(event) =>
                      setEditForm((current) =>
                        current ? { ...current, isSpotlight: event.target.checked } : current,
                      )
                    }
                  />
                  Feature in spotlight
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={closeEditModal}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleEditSubmit()}
                disabled={createAlumnusMutation.isPending || updateAlumnusMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
              >
                {createAlumnusMutation.isPending || updateAlumnusMutation.isPending
                  ? "Saving..."
                  : editingUser
                    ? "Save Changes"
                    : "Create Alumni"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
