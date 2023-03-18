import {  Meta, StoryObj } from "@storybook/react";

import ProductInfo from '.';
import type { Props } from '.';

export default {
  title: "Composites/ProductInfo",
  component: ProductInfo,
  args: {}
} as Meta;




type Story = StoryObj<typeof ProductInfo>;


export const Default: Story = {
  args: {

  }
};

