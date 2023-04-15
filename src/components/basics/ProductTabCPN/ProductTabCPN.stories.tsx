import { Meta, StoryObj } from "@storybook/react";

import ProductTabCPN from ".";
import type { Props } from ".";

const sampleProduct = {
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

const defaultArgs: Props = {
  ...sampleProduct,
};

const Wrapper = (args: Props) => (
  <div
    style={{
      width: "300px",
      height: "100px",
    }}
  >
    <ProductTabCPN {...args} />
  </div>
);

export default {
  title: "Basics/ProductTabCPN",
  component: Wrapper,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ProductTabCPN>;

export const ShortProductTab: Story = {};

export const DetailedProductTab: Story = {
  args: {
    detailed: true,
  },
};
