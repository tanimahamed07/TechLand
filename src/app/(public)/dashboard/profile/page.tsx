"use client";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getMyProfile,
  updateMyProfile,
  updatePassword,
} from "@/service/user.service";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  // Profile form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(true);

  // Password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ?? "");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Load user profile data from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getMyProfile();
        setName(userData.name || "");
        setPhone(userData.phone || "");
        setAvatar(userData.avatar || "");
        setAvatarPreview(userData.avatar || "");

        // Load address if exists
        if (userData.address) {
          setStreet(userData.address.street || "");
          setCity(userData.address.city || "");
          setCountry(userData.address.country || "");
          setZip(userData.address.zip || "");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const regenerateAvatar = () => {
    const seed = Math.random().toString(36).slice(2, 8);
    const url = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
    setAvatar(url);
    setAvatarPreview(url);
  };

  const initials = React.useMemo(() => {
    const name = session?.user?.name ?? session?.user?.email ?? "User";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [session]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");

    try {
      const updatedUser = await updateMyProfile({
        name,
        phone: phone || undefined,
        avatar: avatar || undefined,
        address: {
          street: street || undefined,
          city: city || undefined,
          country: country || undefined,
          zip: zip || undefined,
        },
      });

      // Update session
      await update({
        ...session,
        user: {
          ...user,
          name: updatedUser.name,
          image: updatedUser.avatar,
        },
      });

      setProfileMessage("Profile updated successfully!");
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (err: any) {
      setProfileMessage(err?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match");
      setSavingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      setSavingPassword(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword,
        newPassword,
      });
      setPasswordMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (err: any) {
      setPasswordMessage(err?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black text-base-content">My Profile</h1>

      {/* Account Info */}
      <div className="card bg-base-100 border border-base-300 shadow-sm p-5">
        <h2 className="font-bold text-sm text-base-content/50 uppercase tracking-wider mb-4">
          Account
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-base-content/50 text-xs mb-0.5">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-base-content/50 text-xs mb-0.5">Role</p>
            <span
              className={`badge badge-sm ${user.role === "admin" ? "badge-warning" : "badge-info"}`}
            >
              {user.role}
            </span>
          </div>
          <div>
            <p className="text-base-content/50 text-xs mb-0.5">Member since</p>
            <p className="font-medium">{joinDate}</p>
          </div>
          <div>
            <p className="text-base-content/50 text-xs mb-0.5">
              Email Verification
            </p>
            {user.isVerified ? (
              <span className="flex items-center gap-1.5 text-success text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-warning text-sm font-medium">
                <ShieldX className="w-4 h-4" /> Not verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit}>
        <div className="card bg-base-100 border border-base-300 shadow-sm p-5 space-y-5">
          <h2 className="font-bold text-sm text-base-content/50 uppercase tracking-wider">
            Personal Information
          </h2>

          {profileMessage && (
            <div
              className={`alert ${profileMessage.includes("success") ? "alert-success" : "alert-error"} alert-sm`}
            >
              {profileMessage}
            </div>
          )}

          {/* Avatar */}
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-base-300 bg-base-200 shrink-0">
              <Avatar className="">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <AvatarImage
                  src={session.user.image ?? "https://github.com/shadcn.png"}
                  alt={session.user.name ?? "User avatar"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-2">
              <label className="label pb-0.5">
                <span className="label-text text-xs font-medium">
                  Avatar URL
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => {
                    setAvatar(e.target.value);
                    setAvatarPreview(e.target.value);
                  }}
                  placeholder="https://example.com/avatar.png"
                  className="input input-bordered input-sm flex-1"
                />
                <button
                  type="button"
                  onClick={regenerateAvatar}
                  className="btn btn-ghost btn-sm btn-square"
                  title="Generate random avatar"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">Phone</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="+880 1700 000000"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-semibold text-base-content/70 mb-3">
              Address
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">Street</span>
                </label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House 12, Road 5, Dhanmondi"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">City</span>
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">Country</span>
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">
                    ZIP / Area Code
                  </span>
                </label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="1207"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="btn btn-primary gap-2"
            >
              {savingProfile ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {savingProfile ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordSubmit}>
        <div className="card bg-base-100 border border-base-300 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-sm text-base-content/50 uppercase tracking-wider">
              Change Password
            </h2>
          </div>

          {passwordMessage && (
            <div
              className={`alert ${passwordMessage.includes("success") ? "alert-success" : "alert-error"} alert-sm`}
            >
              {passwordMessage}
            </div>
          )}

          <div className="space-y-4 max-w-sm">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">Current Password</span>
              </label>
              <div className="relative">
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={showCurrent ? "text" : "password"}
                  placeholder="Your current password"
                  className="input input-bordered w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">New Password</span>
              </label>
              <div className="relative">
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showNew ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className="input input-bordered w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">
                  Confirm New Password
                </span>
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Repeat new password"
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={savingPassword}
              className="btn btn-outline btn-primary gap-2"
            >
              {savingPassword ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {savingPassword ? "Updating…" : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
