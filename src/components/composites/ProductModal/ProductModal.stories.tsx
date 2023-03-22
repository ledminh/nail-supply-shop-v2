import {  Meta, StoryObj } from "@storybook/react";

import ProductModal from '.';
import type { Props } from '.';

// {
//   onSave: ({ name, description, image }:onSaveProps) => void;
//   onCancel: () => void;
// } & ({
//   type: "create";
//   initName?: undefined;
//   initDescription?: undefined;
//   initImage?: undefined 

// } | {
//   type: "edit";
//   initName: string;
//   initDescription: string;
//   initImage: RemoteImage;
// })


const defaultArgs: Props = {
  type: "create",
  onSave: () => {},
  onCancel: () => {}
};


export default {
  title: "Composites/ProductModal",
  component: ProductModal,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof ProductModal>;


export const Default: Story = {};