import { Meta, StoryObj } from "@storybook/react";

import { navigationItems } from "@/config";

import HamburgerMenu from ".";
import type { Props } from ".";

const defaultArgs: Props = {
  navigationItems: navigationItems,
  currentPage: "/shop",
};
export default {
  title: "Composites/HamburgerMenu",
  component: HamburgerMenu,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof HamburgerMenu>;

export const Default: Story = {};
