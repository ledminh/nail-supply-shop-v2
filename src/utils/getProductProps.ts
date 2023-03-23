import { Product, ProductGroup } from '@/types/product';

type CombinedProduct = {
  [K in keyof (Product & ProductGroup)]: any;
};

const getProductProps = ({
  products,
  productID,
  props,
}: {
  products: (Product | ProductGroup)[];
  productID: string;
  props: Array<keyof (Product & ProductGroup)>;
}) => {
  const product = products.find((product) => product.id === productID);

  if (!product) {
    throw new Error('Product not found');
  }

  const productProps: Partial<Product & ProductGroup> = {};

  props.forEach((prop) => {
    productProps[prop] = (product as CombinedProduct)[prop];
  });

  return productProps;
};

export default getProductProps;