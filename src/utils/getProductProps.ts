import { Product, ProductGroup } from '@/types/product';

type CombinedProduct = {
  [K in keyof (Product & ProductGroup)]: any;
};

const getProductProps = ({
  products,
  id,
  props,
}: {
  products: (Product | ProductGroup)[];
  id: string;
  props: Array<keyof (Product & ProductGroup)>;
}) => {
  const product = products.find((product) => product.id === id);

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