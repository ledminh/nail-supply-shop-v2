import {  Meta, StoryObj } from "@storybook/react";

import ProductManagementSection from '.';
import type { Props } from '.';

export default {
  title: "Sections/ProductManagementSection",
  component: ProductManagementSection,
  args: {}
} as Meta;




type Story = StoryObj<typeof ProductManagementSection>;


export const Default: Story = {
  args: {

  }
};

