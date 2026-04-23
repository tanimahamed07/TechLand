"use client";

import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
      </div>

      {/* Profile Form Component */}
      <ProfileForm />
    </div>
  );
}
