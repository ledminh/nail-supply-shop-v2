import {  Meta, StoryObj } from "@storybook/react";

import ProductGroupModal from '.';
import type { Props } from '.';



const defaultArgs: Props = {
  type: "create",
  onSave: () => {},
  onCancel: () => {},
  onEditProduct: () => {},
  onDeleteProduct: () => {},
};


export default {
  title: "Composites/ProductGroupModal",
  component: ProductGroupModal,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof ProductGroupModal>;


export const Default: Story = {};