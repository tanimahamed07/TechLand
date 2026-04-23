"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import { confirmToast } from "@/utils/confirmToast";
import { Button } from "@/components/ui/button";
import {
  adminGetAllUsers,
  adminUpdateUserRole,
  adminDeleteUser,
  adminCreateAdmin,
} from "@/service/user.service";
import { UserProfile } from "@/types/user.types";

type RoleFilter = "" | "user" | "admin" | "super-admin";

const ROLE_TABS: { label: string; value: RoleFilter }[] = [
  { label: "All", value: "" },
  { label: "Users", value: "user" },
  { label: "Admins", value: "admin" },
  { label: "Super Admins", value: "super-admin" },
];

const roleBadgeClass: Record<string, string> = {
  "super-admin":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  user: "bg-muted text-muted-foreground",
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "super-admin";
  const currentUserId = session?.user?.id;

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Create admin modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUsers = async (p = page, role = roleFilter, s = search) => {
    try {
      setLoading(true);
      const result = await adminGetAllUsers({
        page: p,
        limit: 15,
        role: role || undefined,
        search: s || undefined,
      });
      setUsers(result.data || []);
      setTotalPages(result.meta?.totalPages || 1);
      setTotal(result.meta?.total || 0);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await adminGetAllUsers({
          page,
          limit: 15,
          role: roleFilter || undefined,
        });
        setUsers(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
        setTotal(result.meta?.total || 0);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, roleFilter]);

  const handleRoleChange = async (user: UserProfile, newRole: string) => {
    if (!isSuperAdmin) return;
    try {
      setRoleChanging(user._id);
      await adminUpdateUserRole(user._id, newRole);
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setRoleChanging(null);
    }
  };

  const handleDelete = async (user: UserProfile) => {
    if (!isSuperAdmin) return;
    const confirmed = await confirmToast(
      `Delete "${user.name}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(user._id);
      await adminDeleteUser(user._id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setCreating(true);
      await adminCreateAdmin({
        name: newName,
        email: newEmail,
        password: newPassword,
      });
      toast.success("Admin created successfully");
      setShowCreate(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      fetchUsers();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create admin",
      );
    } finally {
      setCreating(false);
    }
  };

  const canDelete = (user: UserProfile) => {
    if (!isSuperAdmin) return false;
    if (user._id === currentUserId) return false;
    if (user.role === "super-admin") return false;
    return true;
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">{total} users total</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              fetchUsers(1, roleFilter, e.target.value);
            }}
            className="w-64 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {isSuperAdmin && (
            <Button onClick={() => setShowCreate(true)} size="sm">
              <UserPlus className="mr-2 h-4 w-4" /> Add Admin
            </Button>
          )}
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-1">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setRoleFilter(tab.value);
              setPage(1);
            }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              roleFilter === tab.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[...Array(4)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-16 text-center text-muted-foreground"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          user.avatar ||
                          `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user._id}`
                        }
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="max-w-[160px] truncate font-medium">
                          {user.name}
                          {user._id === currentUserId && (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    {isSuperAdmin &&
                    user.role !== "super-admin" &&
                    user._id !== currentUserId ? (
                      <select
                        value={user.role}
                        disabled={roleChanging === user._id}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer ${roleBadgeClass[user.role]}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${roleBadgeClass[user.role] || roleBadgeClass.user}`}
                      >
                        {user.role === "super-admin"
                          ? "Super Admin ★"
                          : user.role}
                      </span>
                    )}
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    {canDelete(user) ? (
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={deleting === user._id}
                        className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                      >
                        {deleting === user._id ? "Deleting..." : "Delete"}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground/30">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold">Create Admin Account</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full Name"
                className={inputClass}
              />
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
                className={inputClass}
              />
              <input
                required
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                minLength={6}
                className={inputClass}
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={creating}>
                  {creating ? "Creating..." : "Create Admin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
