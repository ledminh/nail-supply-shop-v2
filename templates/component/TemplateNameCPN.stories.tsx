import {  Meta, StoryObj } from "@storybook/react";

import templatenameCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {};


export default {
  title: "Basics/CategoryBlockCPN",
  component: templatenameCPN,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof templatenameCPN>;


export const Default: Story = {};

