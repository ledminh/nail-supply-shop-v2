import { Meta, StoryObj } from "@storybook/react";

import CategoryManagementSection from ".";
import type { Props } from ".";

export default {
  title: "Sections/CategoryManagementSection",
  component: CategoryManagementSection,
  args: {},
} as Meta;

type Story = StoryObj<typeof CategoryManagementSection>;

export const Default: Story = {
  args: {},
};
