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
  EyeOff,
  Smartphone,
  Monitor,
  Loader2,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখার জন্য
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ডেমো লগইন ফাংশন
  const handleDemoLogin = (roleEmail: string) => {
    setFormData({
      email: roleEmail,
      password: "password123",
    });
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError("Google sign-in failed");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fe] px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-3xl bg-card shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Left Side */}
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
                Your Gadget Destination
              </h1>
              <p className="text-md text-muted-foreground max-w-[300px] font-medium leading-relaxed">
                Ship Smarter, Deliver Faster. Access your TechLand business
                dashboard.
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

          {/* Right Side */}
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

              {/* Demo Login Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-8"
                  onClick={() => handleDemoLogin("user@techland.com")}
                >
                  <User className="mr-1 h-3 w-3" /> User
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-8"
                  onClick={() => handleDemoLogin("admin1@techland.com")}
                >
                  <ShieldCheck className="mr-1 h-3 w-3" /> Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-8"
                  onClick={() => handleDemoLogin("super@techland.com")}
                >
                  <Zap className="mr-1 h-3 w-3" /> Super
                </Button>
              </div>

              {/* Google Sign-In Button */}
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-border bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {isGoogleLoading ? "Connecting..." : "Sign in with Google"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">
                    Or continue with email
                  </span>
                </div>
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
                      type={showPassword ? "text" : "password"} // টাইপ পরিবর্তন হবে
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 border-border bg-background pl-12 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // আইকন ক্লিক হ্যান্ডলার
                      className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      required // চেকবক্স রিকোয়ার্ড করা হয়েছে
                      className="rounded-md border-border"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium text-muted-foreground cursor-pointer"
                    >
                      Accept terms to sign in
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
