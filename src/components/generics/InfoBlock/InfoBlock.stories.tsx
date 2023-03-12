import React from "react";
import {  Meta, StoryObj } from "@storybook/react";

import InfoBlock from '.';
import type { Props } from '.';

const SampleNode = () => (
  <div style={{
    height: "200px",
    backgroundColor: "rgba(136, 136, 136, 0.7)"
  }}>
    Sample Node
  </div>
);

const defaultArgs:Props = {
  title: "Title",
  children: <SampleNode />
};

const Wrapper = (args:Props) => (
  <div style={{
    width: "40vw",
    height: "100%",
    backgroundColor: "rgba(136, 136, 136, 0.7)"
  }}>
    <InfoBlock {...args} />
  </div>
);


export default {
  title: "Generics/InfoBlock",
  component: Wrapper,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof InfoBlock>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
};

