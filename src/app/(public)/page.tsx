import HeroSection from "@/components/banner/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="container py-8">
        <HeroSection></HeroSection>
      </main>
    </div>
  );
}
