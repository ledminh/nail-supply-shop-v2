import { Product, ProductGroup } from "@/types/product";

export default function isProduct(
  product: Product | ProductGroup
): product is Product {
  return (product as Product).price !== undefined;
}
