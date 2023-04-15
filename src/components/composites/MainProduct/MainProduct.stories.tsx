import { Meta, StoryObj } from "@storybook/react";

import MainProduct from ".";
import type { Props } from ".";

const defaultArgs: Props = {
  product: {
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
  },
};

const Wrapper = (args: Props) => (
  <div
    style={{
      width: "400px",
      height: "400px",
    }}
  >
    <MainProduct {...args} />
  </div>
);

export default {
  title: "Composites/MainProduct",
  component: Wrapper,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof MainProduct>;

export const Default: Story = {
  args: {},
};
