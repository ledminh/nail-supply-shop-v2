import {  Meta, StoryObj } from "@storybook/react";

import StatusSelectCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {};


export default {
  title: "Basics/StatusSelectCPN",
  component: StatusSelectCPN,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof StatusSelectCPN>;


export const Default: Story = {};

