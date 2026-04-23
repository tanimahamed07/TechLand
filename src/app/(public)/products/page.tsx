import { getAllProducts } from "@/service/product.service";
import { getCategoryTree } from "@/service/category.service";
import ProductsContent from "@/components/products/ProductsContent";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const query: {
    page: number;
    limit: number;
    category?: string;
    brand?: string;
    search?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    sort?: string;
  } = {
    page: Number(params.page) || 1,
    limit: 12,
  };

  if (params.subcategory || params.category) {
    query.category = params.subcategory || params.category;
  }

  if (params.brand) {
    query.brand = params.brand;
  }

  if (params.search) {
    query.search = params.search;
  }

  if (params.priceMin) {
    query.priceMin = Number(params.priceMin);
  }
  if (params.priceMax) {
    query.priceMax = Number(params.priceMax);
  }

  if (params.rating) {
    query.rating = Number(params.rating);
  }

  if (params.sortBy) {
    const sortMap: Record<string, string> = {
      "price-low": "price",
      "price-high": "-price",
      newest: "-createdAt",
      oldest: "createdAt",
      rating: "rating",
      popular: "-sold",
    };
    query.sort = sortMap[params.sortBy] || "-createdAt";
  }

  const [productsData, categoriesData] = await Promise.all([
    getAllProducts(query),
    getCategoryTree(),
  ]);

  const products = productsData.data || [];
  const categories = categoriesData.data || [];
  const meta = productsData.meta;

  return (
    <ProductsContent
      initialProducts={products}
      initialCategories={categories}
      meta={meta}
    />
  );
}
