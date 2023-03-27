import {  Meta, StoryObj } from "@storybook/react";

import TextAreaBlockCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {};


export default {
  title: "Basics/TextAreaBlockCPN",
  component: TextAreaBlockCPN,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof TextAreaBlockCPN>;


export const Default: Story = {};

