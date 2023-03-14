import {  Meta, StoryObj } from "@storybook/react";

import DropMenuCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {};


export default {
  title: "Basics/DropMenuCPN",
  component: DropMenuCPN,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof DropMenuCPN>;


export const Default: Story = {};

