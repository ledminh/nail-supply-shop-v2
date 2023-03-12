import {  Meta, StoryObj } from "@storybook/react";

import FeaturedProductsSection from '.';
import type { Props } from '.';

export default {
  title: "Sections/FeaturedProductsSection",
  component: FeaturedProductsSection,
  args: {}
} as Meta;




type Story = StoryObj<typeof FeaturedProductsSection>;


export const Default: Story = {
  args: {

  }
};

