"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  ShieldCheck,
  User,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // toast use korle consistency thake

import {
  getMyProfile,
  updateMyProfile,
  updatePassword,
} from "@/service/user.service";
import { UserProfile } from "@/types/user.types";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return;
      try {
        const data = await getMyProfile();
        setProfile(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setAvatar(data.avatar || "");
        setStreet(data.address?.street || "");
        setCity(data.address?.city || "");
        setCountry(data.address?.country || "");
        setZip(data.address?.zip || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session]);

  const regenerateAvatar = () => {
    const seed = Math.random().toString(36).slice(2, 8);
    setAvatar(`https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`);
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await updateMyProfile({
        name,
        phone,
        avatar,
        address: { street, city, country, zip },
      });
      setProfile(updated);
      // Session update - name, image, role sync kora
      await update({
        user: {
          name: updated.name,
          image: updated.avatar,
          role: updated.role ?? session?.user?.role,
        },
      });
      // Dashboard layout ke notify kora fresh data load korte
      window.dispatchEvent(new Event("profileUpdated"));
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    setSavingPassword(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-40 rounded-lg border bg-card animate-pulse" />
        <div className="h-64 rounded-lg border bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase px-2"
        >
          {profile?.role || "User"}
        </Badge>
      </div>

      {/* Account Info (OrderCard Style) */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-16 w-16 rounded-lg border border-border shadow-sm">
                <AvatarImage src={avatar || session?.user?.image || ""} />
                <AvatarFallback className="rounded-lg uppercase font-bold">
                  {name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={regenerateAvatar}
                className="absolute -bottom-1 -right-1 bg-background border rounded-md p-1 shadow-sm hover:bg-muted transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-primary" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm truncate">{profile?.name}</h2>
              <p className="text-[11px] font-mono text-muted-foreground truncate">
                {profile?.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-[10px] font-medium text-green-600">
                  <CheckCircle2 className="w-3 h-3" /> Verified Account
                </span>
                <span className="text-[10px] text-muted-foreground">
                  • Joined{" "}
                  {new Date(profile?.createdAt || "").toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Personal Info Form */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/20 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-tight">
            Personal Details
          </h3>
        </div>
        <CardContent className="p-4">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Shipping Address
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <input
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
              />
              <input
                placeholder="ZIP Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
              />
            </div>

            <Button
              disabled={savingProfile}
              size="sm"
              className="w-full sm:w-auto gap-2 text-xs"
            >
              {savingProfile ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              Save Profile
            </Button>
          </form>
        </CardContent>
      </div>

      {/* Security Section */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/20 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-tight">
            Security & Password
          </h3>
        </div>
        <CardContent className="p-4">
          <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-sm">
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-1.5 text-sm pr-10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2 text-muted-foreground"
              >
                {showCurrent ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-1.5 text-sm pr-10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2 text-muted-foreground"
              >
                {showNew ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
            />
            <Button
              disabled={savingPassword}
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
            >
              {savingPassword ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <ShieldCheck className="w-3 h-3" />
              )}
              Update Password
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
