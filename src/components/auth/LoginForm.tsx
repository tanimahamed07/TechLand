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
  LogIn,
  Eye,
  Smartphone,
  Monitor,
  Loader2,
} from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fe] px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-3xl bg-card shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Left Side: আইকন এবং ব্র্যান্ডিং (ইমেজ এরর ফিক্সড) */}
          <div className="relative hidden flex-1 items-center justify-center p-10 md:flex md:flex-col bg-gradient-to-br from-[#e0e8f9] to-[#f4f7fe]">
            <div className="relative z-10 space-y-4 text-center">
              {/* TechLand Logo */}
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
                Your Gadget Destination
              </h1>
              <p className="text-md text-muted-foreground max-w-[300px] font-medium leading-relaxed">
                Ship Smarter, Deliver Faster. Access your TechLand business
                dashboard.
              </p>
            </div>

            {/* গ্যাজেট রিলেটেড আইকন গ্রাফিক্স (ইমেজের বিকল্প) */}
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

          {/* Right Side: Login Form (আগের মতোই) */}
          <div className="flex flex-1 items-center justify-center bg-card p-10 sm:p-16 border-l border-border/50">
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-3 text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Welcome to <span className="text-primary">TechLand</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  Welcome back! Please enter your details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email / Username
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
                    <div className="absolute right-3.5 top-3.5">
                      <div className="h-5 w-5 rounded-sm bg-emerald-500/10 flex items-center justify-center">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 border-border bg-background pl-12 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 pr-12"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      className="rounded-md border-border"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium text-muted-foreground cursor-pointer"
                    >
                      Remember for 30 days
                    </label>
                  </div>
                  <Link
                    href="#"
                    className="text-sm font-bold text-primary hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  className="w-full py-7 text-lg font-bold bg-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98]"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <LogIn className="ml-2 h-5 w-5" />
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
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-primary hover:underline underline-offset-4"
                  >
                    Sign up
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

export default LoginForm;
