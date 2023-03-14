import {  Meta, StoryObj } from "@storybook/react";

import DropMenuCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {};


const Wrapper = (args:Props) => (
  <div style={{ 
    width: "400px",
    border: "6px solid gray",
    }}>
    <DropMenuCPN {...args} />
  </div>
);

export default {
  title: "Basics/DropMenuCPN",
  component: Wrapper,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof DropMenuCPN>;


export const Default: Story = {};

