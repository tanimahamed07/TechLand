"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
  Truck,
  User,
  Package,
  MessageSquare,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border transition-colors duration-300">
      <div className="container mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-110">
                <span className="text-xl font-bold text-primary-foreground">
                  T
                </span>
              </div>
              <span className="text-xl font-bold text-foreground">
                TechLand
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your premium destination for the latest gadgets and electronics.
              Authentic products with official warranty.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Account Links (From Dashboard Sidebar) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Account
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/profile"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" /> Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/my-orders"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
                >
                  <Package className="w-3.5 h-3.5" /> My Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/my-reviews"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> My Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/wishlist"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5" /> Wishlist
                </Link>
              </li>
              {(session?.user?.role === "admin" ||
                session?.user?.role === "super-admin") && (
                <li>
                  <Link
                    href="/admin-panel"
                    className="text-sm text-primary font-bold flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Shop Links (From Navbar) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=laptops"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=smartphones"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Smartphones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                hello@techland.com
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 opacity-50" />

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 transition-colors hover:border-primary/30">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              100% Authentic
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 transition-colors hover:border-primary/30">
            <Truck className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              Fast Delivery
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 transition-colors hover:border-primary/30">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              Secure Payment
            </span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-8">
          <p className="text-[11px] text-muted-foreground">
            © {currentYear}{" "}
            <span className="font-bold text-foreground">TechLand</span>.
            Developed by{" "}
            <Link
              href="https://github.com/TanimAhamed"
              className="font-bold text-primary hover:underline"
            >
              Tanim Ahamed
            </Link>
          </p>

          <div className="flex items-center gap-6 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              width={60}
              height={20}
              className="h-4"
              style={{ width: "auto", height: "16px" }}
            />
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              width={40}
              height={30}
              className="h-6"
              style={{ width: "auto", height: "24px" }}
            />
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              width={50}
              height={15}
              className="h-3 w-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
