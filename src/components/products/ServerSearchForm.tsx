"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ServerSearchFormProps {
  currentSearch?: string;
  searchParams: { [key: string]: string | undefined };
}

export default function ServerSearchForm({
  currentSearch,
  searchParams,
}: ServerSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState(currentSearch || "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();

    // Preserve other params except page
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "search" && key !== "page" && value) {
        params.set(key, value);
      }
    });

    // Add search if not empty
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    // Reset to page 1
    params.set("page", "1");

    const url = `/products${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
    </form>
  );
}
