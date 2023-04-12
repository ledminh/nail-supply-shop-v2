import { Meta, StoryObj } from "@storybook/react";

import OrderManagementSection from ".";
import type { Props } from ".";

export default {
  title: "Sections/OrderManagementSection",
  component: OrderManagementSection,
  args: {},
} as Meta;

type Story = StoryObj<typeof OrderManagementSection>;

export const Default: Story = {
  args: {},
};
