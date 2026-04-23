"use client";

import { useRouter } from "next/navigation";

interface ServerSortSelectProps {
  currentSort: string;
  searchParams: { [key: string]: string | undefined };
}

export default function ServerSortSelect({
  currentSort,
  searchParams,
}: ServerSortSelectProps) {
  const router = useRouter();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams();

    // Preserve other params except page
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "sortBy" && key !== "page" && value) {
        params.set(key, value);
      }
    });

    // Set new sort
    params.set("sortBy", newSort);

    // Reset to page 1
    params.set("page", "1");

    const url = `/products${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="rounded-md border border-input bg-background px-3 py-1.5 text-sm w-full sm:w-auto focus:ring-2 focus:ring-primary outline-none"
    >
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">Top Rated</option>
      <option value="popular">Most Popular</option>
    </select>
  );
}
