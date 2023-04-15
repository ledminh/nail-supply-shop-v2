import { Meta, StoryObj } from "@storybook/react";

import CategoryList from ".";
import type { Props } from ".";

const categorySample = {
  image: {
    src: "https://loremflickr.com/400/400",
    alt: "Category Image",
  },
  name: "Category Name",
  description:
    "lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon",
  numProducts: 10,
};

const defaultArgs: Props = {
  categories: [
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
  ],
};

const Wrapper = (args: Props) => (
  <div style={{ width: "30vw" }}>
    <CategoryList {...args} />
  </div>
);

export default {
  title: "Composites/CategoryList",
  component: Wrapper,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof CategoryList>;

export const Default: Story = {};

export const Detailed: Story = {
  args: {
    detailed: true,
  },
};

export const Vertical: Story = {
  args: {
    vertical: true,
  },
};
