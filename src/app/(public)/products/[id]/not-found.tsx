import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Product not found
        </h2>
        <p className="mt-2 text-muted-foreground">
          The product you are looking for does not exist.
        </p>
        <Link href="/products">
          <Button className="mt-4">Back to Products</Button>
        </Link>
      </div>
    </div>
  );
}
