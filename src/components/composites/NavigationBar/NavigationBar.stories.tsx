import {  Meta, StoryObj } from "@storybook/react";

import NavigationBar from '.';


export default {
  title: "Composites/NavigationBar",
  component: NavigationBar,

} as Meta;




type Story = StoryObj<typeof NavigationBar>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    currentPage: "/shop",
  }
};

