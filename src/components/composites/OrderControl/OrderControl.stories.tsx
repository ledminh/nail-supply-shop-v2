import {  Meta, StoryObj } from "@storybook/react";

import OrderControl from '.';
import type { Props } from '.';

export default {
  title: "Composites/OrderControl",
  component: OrderControl,
  args: {}
} as Meta;




type Story = StoryObj<typeof OrderControl>;


export const Default: Story = {
  args: {

  }
};

