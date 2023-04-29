import type { DBProductGroup } from "@/types/product";
import toDBProduct from "./toDBProduct";

import { Product, Group } from "@prisma/client";

export default function toDBProductGroup(
  productGroup: Group,
  products: Product[]
): DBProductGroup {
  const _productGroup = {
    ...productGroup,
    products: products
      .filter((p) => p.groupID === productGroup.id)
      .map((product) => toDBProduct(product)),
    dateCreated: productGroup.dateCreated.toISOString(),
    lastUpdated: productGroup.lastUpdated.toISOString(),
  };

  return _productGroup;
}
