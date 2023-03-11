import React from "react";
import {  Meta, StoryObj } from "@storybook/react";

import templatename from '.';
import type { Props } from '.';


export default {
  title: "Generics/templatename",
  component: templatename,
  args: {}
} as Meta;




type Story = StoryObj<typeof templatename>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
};

