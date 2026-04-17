import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Welcome to TechLand</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your one-stop shop for all electronics and gadgets.
        </p>
      </main>
    </div>
  );
}
