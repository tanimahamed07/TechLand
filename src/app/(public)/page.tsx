import HeroSection from "@/components/banner/HeroSection";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="mx-auto">
        {" "}
        {/* mx-auto add kora hoyeche */}
        <HeroSection />
      </main>
    </div>
  );
}
