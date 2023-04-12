import { Meta, StoryObj } from "@storybook/react";

import ProductGroupModal from ".";
import type { Props } from ".";

const productSample = {
  id: "1",
  name: "Product Name",
  price: 100,
  intro:
    "This is some intro text. I'm trying to make it longer to see if it fit on the frame",
  details:
    "This is some details text. I'm trying to make it longer to see if it fit on the frame. Something more to say here to make it longer, and even longer, longer, longer",
  categoryID: "1",
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

const defaultArgs: Props = {
  type: "create",
  onSave: () => {},
  onCancel: () => {},
  onEditProduct: () => {},
  onDeleteProduct: () => {},
  onAddNewProduct: () => {},
};

export default {
  title: "Composites/ProductGroupModal",
  component: ProductGroupModal,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ProductGroupModal>;

export const Create: Story = {};
export const Edit: Story = {
  args: {
    type: "edit",
    initProducts: productSamples,
    initName: "Group Name",
  },
};
