import { Meta, StoryObj } from "@storybook/react";

import CategoryPage from "@/pages/category/[slug]";
import type { Props } from "@/pages/category/[slug]";

import { Category } from "@/types/category";
import { ContactInfo } from "@/types/others";
import { categoryConfig } from "@/config";

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

const productSample = {
  id: "1",
  name: "Product Name",
  price: 100,
  intro:
    "This is some intro text. I'm trying to make it longer to see if it fit on the frame",
  details: 'This is some "details" text.',
  categoryID: "1111",
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

const productSamples = [
  {
    ...productSample,
    id: "1",
  },
  {
    ...productSample,
    id: "2",
  },
  {
    ...productSample,
    id: "3",
  },
  {
    ...productSample,
    id: "4",
  },
  {
    ...productSample,
    id: "5",
  },
];

const categorySample = {
  image: {
    src: "https://loremflickr.com/400/400",
    alt: "Category Image",
  },
  name: "Category Name",
  numProducts: 10,
  description:
    "Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon.",
};

const categories: Category[] = [
  {
    ...categorySample,
    id: "1",
    slug: "category-1",
  },
  {
    ...categorySample,
    id: "2",
    slug: "category-2",
  },
  {
    ...categorySample,
    id: "3",
    slug: "category-3",
  },
  {
    ...categorySample,
    id: "4",
    slug: "category-4",
  },
  {
    ...categorySample,
    id: "5",
    slug: "category-5",
  },
  {
    ...categorySample,
    id: "6",
    slug: "category-6",
  },
  {
    ...categorySample,
    id: "7",
    slug: "category-7",
  },
  {
    ...categorySample,
    id: "8",
    slug: "category-8",
  },
];

const productWithGroupSamples = [
  {
    ...productSample,
    id: "1",
  },
  {
    name: "Product Group Name",
    products: [
      {
        ...productSample,
        id: "1",
        name: "Product Name 1",
        price: 100,
      },
      {
        ...productSample,
        id: "2",
        name: "Product Name 2",
        price: 200,
      },
      {
        ...productSample,
        id: "3",
        name: "Product Name 3",
        price: 300,
      },
    ],
    id: "2",
    categoryID: "1111",

  },
  {
    ...productSample,
    id: "3",
  },
  {
    ...productSample,
    id: "4",
  },
  {
    ...productSample,
    id: "5",
  },
];

const sortItem = categoryConfig.sortItems[0];
const sortedOrderItem = categoryConfig.sortedOrderItems[0];

const defaultArgs: Props = {
  contactInfo: contactInfo,
  aboutUsFooter: aboutUsFooter,
  categories: categories,

  products: productWithGroupSamples,
  initCondition: {
    sort: sortItem,
    sortedOrder: sortedOrderItem,
  },

  initCategory: categories[0],

};

const Wrapper = (props: Props) => {
  const cartProviderValue = useCartProviderValue();

  return (
    <CartContext.Provider value={cartProviderValue}>
      <CategoryPage {...props} />
    </CartContext.Provider>
  );
};

export default {
  title: "Pages/Category",
  component: Wrapper,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof CategoryPage>;

export const Default: Story = {};
