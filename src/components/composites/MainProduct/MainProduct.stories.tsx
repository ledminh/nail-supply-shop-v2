import {  Meta, StoryObj } from "@storybook/react";

import MainProduct from '.';
import type { Props } from '.';

export default {
  title: "Composites/MainProduct",
  component: MainProduct,
  args: {}
} as Meta;




type Story = StoryObj<typeof MainProduct>;


export const Default: Story = {
  args: {

  }
};

