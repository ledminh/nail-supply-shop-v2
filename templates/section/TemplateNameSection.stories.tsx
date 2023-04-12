import { Meta, StoryObj } from "@storybook/react";

import templatenameSection from ".";
import type { Props } from ".";

export default {
  title: "Sections/templatenameSection",
  component: templatenameSection,
  args: {},
} as Meta;

type Story = StoryObj<typeof templatenameSection>;

export const Default: Story = {
  args: {},
};
