import {  Meta, StoryObj } from "@storybook/react";

import CategoryModal from '.';
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
  title: "Composites/CategoryModal",
  component: CategoryModal,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof CategoryModal>;


export const Default: Story = {};