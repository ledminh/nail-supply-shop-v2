import {  Meta, StoryObj } from "@storybook/react";

import BannerCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {
  text: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
};


export default {
  title: "Basics/BannerCPN",
  component: BannerCPN,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof BannerCPN>;


export const Default: Story = {};

