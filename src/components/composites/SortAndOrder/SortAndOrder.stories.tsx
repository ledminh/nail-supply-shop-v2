import {  Meta, StoryObj } from "@storybook/react";

import SortAndOrder from '.';
import type { Props } from '.';

export default {
  title: "Composites/SortAndOrder",
  component: SortAndOrder,
  args: {}
} as Meta;




type Story = StoryObj<typeof SortAndOrder>;


export const Default: Story = {
  args: {

  }
};

