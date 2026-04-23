/**
 * Get valid image URL with fallback
 * @param images - Array of image URLs
 * @param fallbackUrl - Optional custom fallback URL
 * @returns Valid image URL or fallback
 */
export const getValidImageUrl = (
  images: string[] | undefined,
  fallbackUrl: string = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image",
): string => {
  // Check if images array exists and has items
  if (!images || !Array.isArray(images) || images.length === 0) {
    return fallbackUrl;
  }

  // Get first image and trim whitespace
  const imageUrl = images[0]?.trim();

  // Check if URL exists and starts with http
  if (!imageUrl || !imageUrl.startsWith("http")) {
    return fallbackUrl;
  }

  // Basic URL validation
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    return fallbackUrl;
  }
};
