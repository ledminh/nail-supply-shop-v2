import {  Meta, StoryObj } from "@storybook/react";

import OthersManagementSection from '.';
import type { Props } from '.';

export default {
  title: "Sections/OthersManagementSection",
  component: OthersManagementSection,
  args: {}
} as Meta;




type Story = StoryObj<typeof OthersManagementSection>;


export const Default: Story = {
  args: {

  }
};

