import {  Meta, StoryObj } from "@storybook/react";

import templatenameSection from '.';
import type { Props } from '.';

export default {
  title: "Sections/templatename",
  component: templatenameSection,
  args: {}
} as Meta;




type Story = StoryObj<typeof templatenameSection>;


export const Default: Story = {
  args: {

  }
};

