import {  Meta, StoryObj } from "@storybook/react";

import OrderSummary from '.';
import type { Props } from '.';

export default {
  title: "Composites/OrderSummary",
  component: OrderSummary,
  args: {}
} as Meta;




type Story = StoryObj<typeof OrderSummary>;


export const Default: Story = {
  args: {

  }
};

