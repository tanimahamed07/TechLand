import { useRouter } from "next/navigation";
import { addToCart as addToCartService } from "@/service/cart.service";

export function useCart() {
  const router = useRouter();

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      await addToCartService(productId, quantity);
      router.refresh(); // Refresh to update cart count
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  return {
    addToCart,
  };
}
