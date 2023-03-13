import {  Meta, StoryObj } from "@storybook/react";

import HamburgerMenu from '.';
import type { Props } from '.';

export default {
  title: "Composites/HamburgerMenu",
  component: HamburgerMenu,
  args: {}
} as Meta;




type Story = StoryObj<typeof HamburgerMenu>;


export const Default: Story = {
  args: {

  }
};

