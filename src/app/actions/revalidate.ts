"use server";

import { revalidateTag } from "next/cache";

export async function revalidateCategories() {
  revalidateTag("categories", "default");
}

export async function revalidateProducts() {
  revalidateTag("products", "default");
}
