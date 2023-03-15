import {  Meta, StoryObj } from "@storybook/react";

import CategoryBlockCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {
    image: {
      src: "https://loremflickr.com/200/200",
      alt: "Category Image",
    },
    name: "Category Name",
    description: "lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon",
};

const Wrapper = (args:Props) => (
  <div style={{width: "250px"}}>
    <CategoryBlockCPN {...args} />
  </div>
  );

export default {
  title: "Basics/CategoryBlockCPN",
  component: Wrapper,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof CategoryBlockCPN>;


export const Default: Story = {};

export const Detailed: Story = {
    args: {
        detailed: true
    }
};

export const Vertical: Story = {
    args: {
        vertical: true
    }
};

