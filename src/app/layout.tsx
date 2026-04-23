import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechLand — Modern Electronics Store",
    template: "%s | TechLand",
  },
  description:
    "Discover the latest electronics, gadgets, and tech accessories at unbeatable prices.",
  keywords: ["electronics", "gadgets", "smartphones", "laptops", "ecommerce"],
  openGraph: {
    title: "TechLand — Modern Electronics Store",
    description: "Discover the latest electronics at unbeatable prices.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <Providers>{children}</Providers>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
