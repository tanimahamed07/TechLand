"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, RefreshCw } from "lucide-react";

export function ProfileForm() {
  const [formData, setFormData] = useState({
    fullName: "Admin User",
    email: "admin@example.com",
    phone: "+1234567890",
    avatarUrl: "https://api.dicebear.com/9/pixel-art/svg?seed=p3fdlj",
    street: "Jhon St. Dhanmondi",
    city: "Dhaka",
    country: "Bangladesh",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>ACCOUNT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge className="bg-yellow-500 hover:bg-yellow-600">admin</Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="font-medium text-foreground">March 20, 2026</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Email Verification
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>PERSONAL INFORMATION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar URL */}
          <div>
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <div className="mt-2 flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={formData.avatarUrl} alt="Avatar" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  placeholder="Enter avatar URL"
                />
              </div>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="mt-2"
              />
            </div>
          </div>

          {/* Address Section */}
          <div>
            <Label className="text-base font-semibold">Address</Label>
            <div className="mt-4 space-y-4">
              {/* Street */}
              <div>
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  className="mt-2"
                />
              </div>

              {/* City & Country */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
