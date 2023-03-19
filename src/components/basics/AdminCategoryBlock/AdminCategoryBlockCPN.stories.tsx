import {  Meta, StoryObj } from "@storybook/react";

import AdminCategoryBlockCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {};


export default {
  title: "Basics/AdminCategoryBlockCPN",
  component: AdminCategoryBlockCPN,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof AdminCategoryBlockCPN>;


export const Default: Story = {};

