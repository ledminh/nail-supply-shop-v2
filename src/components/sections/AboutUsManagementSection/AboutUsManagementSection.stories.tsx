import {  Meta, StoryObj } from "@storybook/react";

import AboutUsManagementSection from '.';
import type { Props } from '.';

export default {
  title: "Sections/AboutUsManagementSection",
  component: AboutUsManagementSection,
  args: {}
} as Meta;




type Story = StoryObj<typeof AboutUsManagementSection>;


export const Default: Story = {
  args: {

  }
};

