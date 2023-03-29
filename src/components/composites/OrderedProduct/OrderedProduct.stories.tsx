import {  Meta, StoryObj } from "@storybook/react";

import OrderedProduct from '.';
import type { Props } from '.';

export default {
  title: "Composites/OrderedProduct",
  component: OrderedProduct,
  args: {}
} as Meta;




type Story = StoryObj<typeof OrderedProduct>;


export const Default: Story = {
  args: {

  }
};

