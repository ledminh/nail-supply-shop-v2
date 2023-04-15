import { Meta, StoryObj } from "@storybook/react";

import ProductPage from "@/pages/product/[id]";
import type { Props } from "@/pages/product/[id]";

import { Category } from "@/types/category";
import { ContactInfo } from "@/types/others";

import CartContext from "@/contexts/CartContext";
import { useCartProviderValue } from "@/contexts/CartContext";

const aboutUsFooter =
  "Nail Essential is a family-owned business that has been providing high-quality nail care products to professionals and enthusiasts for over 20 years. Our mission is to make it easy for our customers to find the products they need to create beautiful and healthy nails. We take pride in offering a wide selection of top-quality products, competitive pricing, and exceptional customer service. Thank you for choosing Nail Essential for all of your nail care needs.";

const contactInfo: ContactInfo = {
  email: "customer.service@example.com",
  phone: "1-800-555-5555",
  additionalInfos: [
    "Monday - Friday: 9:00am - 5:00pm EST",
    "Saturday: 10:00am - 2:00pm EST",
    "Sunday: Closed",
  ],
};

const product = {
  id: "1",
  categoryID: "cat-01",
  name: "Product Name",
  price: 100,
  intro:
    "This is some intro text. I'm trying to make it longer to see if it fit on the frame",
  details:
    "Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon.",
  images: [
    {
      id: "img-1",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 1",
    },
    {
      id: "img-2",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 2",
    },
    {
      id: "img-3",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 3",
    },
  ],
};

const otherProducts = [
  {
    ...product,
    id: "other-1",
  },
  {
    ...product,
    id: "other-2",
  },
  {
    ...product,
    id: "other-3",
  },
  {
    ...product,
    id: "other-4",
  },
  {
    ...product,
    id: "other-5",
  },
];

const categorySample = {
  image: {
    src: "https://loremflickr.com/400/400",
    alt: "Category Image",
  },
  name: "Category Name",
  description:
    "Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon.",
  numProducts: 10,
};

const categories: Category[] = [
  {
    ...categorySample,
    id: "cat-01",
    slug: "category-1",
  },
  {
    ...categorySample,
    id: "cat-02",
    slug: "category-2",
  },
  {
    ...categorySample,
    id: "cat-03",
    slug: "category-3",
  },
  {
    ...categorySample,
    id: "cat-04",
    slug: "category-4",
  },
  {
    ...categorySample,
    id: "cat-05",
    slug: "category-5",
  },
  {
    ...categorySample,
    id: "cat-06",
    slug: "category-6",
  },
  {
    ...categorySample,
    id: "cat-07",
    slug: "category-7",
  },
  {
    ...categorySample,
    id: "cat-08",
    slug: "category-8",
  },
];

const defaultArgs: Props = {
  ...product,
  categories,
  contactInfo,
  aboutUsFooter,
  productID: product.id,
};

const Wrapper = (props: Props) => {
  const cartProviderValue = useCartProviderValue();

  return (
    <CartContext.Provider value={cartProviderValue}>
      <ProductPage {...props} />
    </CartContext.Provider>
  );
};

export default {
  title: "Pages/Product",
  component: Wrapper,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ProductPage>;

export const Single: Story = {};

export const Group: Story = {
  args: {
    groupName: "Group Name",
    otherProducts,
  },
};
