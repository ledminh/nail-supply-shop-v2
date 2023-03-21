import {  Meta, StoryObj } from "@storybook/react";

import WarningModal from '.';
import type { Props } from '.';

const defaultArgs = {
  message: "Are you sure you want to delete this category?",
  onOK: () => {},
  onCancel: () => {}
} as Props;

export default {
  title: "Composites/WarningModal",
  component: WarningModal,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof WarningModal>;


export const Default: Story = {
  args: {

  }
};

