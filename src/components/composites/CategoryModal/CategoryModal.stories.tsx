import {  Meta, StoryObj } from "@storybook/react";

import CategoryModal from '.';
import type { Props } from '.';

export default {
  title: "Composites/CategoryModal",
  component: CategoryModal,
  args: {}
} as Meta;




type Story = StoryObj<typeof CategoryModal>;


export const Default: Story = {
  args: {

  }
};

