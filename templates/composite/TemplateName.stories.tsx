import { Meta, StoryObj } from "@storybook/react";

import templatename from ".";
import type { Props } from ".";

export default {
  title: "Composites/templatename",
  component: templatename,
  args: {},
} as Meta;

type Story = StoryObj<typeof templatename>;

export const Default: Story = {
  args: {},
};
