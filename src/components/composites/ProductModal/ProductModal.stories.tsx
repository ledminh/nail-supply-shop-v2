import {  Meta, StoryObj } from "@storybook/react";

import ProductModal from '.';
import type { Props } from '.';



const defaultArgs: Props = {
  type: "create",
  onSave: () => {},
  onCancel: () => {},
  groupName: "This is a group"
};


export default {
  title: "Composites/ProductModal",
  component: ProductModal,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof ProductModal>;


export const Default: Story = {};