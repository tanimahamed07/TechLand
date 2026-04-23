"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Loader2,
} from "lucide-react";
import { register } from "@/service/auth.service";
import type { RegisterPayload } from "@/types/auth.types";

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখার জন্য
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register(formData);

      // সফল রেজিস্ট্রেশনের পর অটো লগইন
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(
          "Registration successful, but login failed. Please try logging in manually.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fe] px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-3xl bg-card shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Left Side: Branding & Animated Icons */}
          <div className="relative hidden flex-1 items-center justify-center p-10 md:flex md:flex-col bg-gradient-to-br from-[#e0e8f9] to-[#f4f7fe]">
            <div className="relative z-10 space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Link
                  href="/"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30"
                >
                  <span className="text-3xl font-bold text-primary-foreground">
                    T
                  </span>
                </Link>
                <span className="text-4xl font-bold text-foreground tracking-tight">
                  TechLand
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-foreground">
                Join the Tech Community
              </h1>
              <p className="text-md text-muted-foreground max-w-[300px] font-medium leading-relaxed">
                Create your account to access exclusive gadgets and faster
                deliveries.
              </p>
            </div>

            <div className="relative z-10 mt-16 flex items-center justify-center gap-8 opacity-20">
              <div className="animate-bounce transition-all duration-1000">
                <Monitor size={80} className="text-primary" />
              </div>
              <div className="animate-pulse transition-all duration-700">
                <Smartphone size={60} className="text-primary" />
              </div>
            </div>

            <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-0" />
          </div>

          {/* Right Side: Registration Form */}
          <div className="flex flex-1 items-center justify-center bg-card p-10 sm:p-12 border-l border-border/50">
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-3 text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Create <span className="text-primary">Account</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  Start your journey with TechLand today.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 border-border bg-background pl-12 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@techland.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 border-border bg-background pl-12 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 border-border bg-background pl-12 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 pt-1">
                  <Checkbox
                    id="terms"
                    className="mt-1 rounded border-border"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium text-muted-foreground leading-tight cursor-pointer select-none"
                  >
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="text-primary font-bold hover:underline"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-primary font-bold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Register Button */}
                <Button
                  className="w-full py-7 text-lg font-bold bg-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <UserPlus className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {error && (
                  <div className="text-center text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}
              </form>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-primary hover:underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
