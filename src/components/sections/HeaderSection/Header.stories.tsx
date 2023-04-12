import { Meta, StoryObj } from "@storybook/react";

import HeaderSection from ".";

export default {
  title: "Sections/HeaderSection",
  component: HeaderSection,
} as Meta;

type Story = StoryObj<typeof HeaderSection>;

export const Default: Story = {
  args: {
    currentPage: "/shop",
    onSearchSubmit: (query: string) => {
      console.log(query);
    },
  },
};
