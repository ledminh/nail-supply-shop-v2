import type { DBProductGroup } from "@/types/product";
import toDBProduct from "./toDBProduct";

export default function toDBProductGroup(
  productGroup: PrismaProductGroup,
  products: PrismaProduct[]
): DBProductGroup {
  const _productGroup = {
    ...productGroup,
    products: products.filter(p => p.groupID === productGroup.id).map((product) => toDBProduct(product)),
    dateCreated: productGroup.dateCreated.toISOString(),
    lastUpdated: productGroup.lastUpdated.toISOString(),
    
  };

  return _productGroup;
}