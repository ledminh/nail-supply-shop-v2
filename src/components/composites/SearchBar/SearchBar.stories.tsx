import {  Meta, StoryObj } from "@storybook/react";

import SearchBar from ".";

// import type { Props } from ".";

// const defaultArgs: Props = {
//     label: "Link 1",
// };

export default {
    title: "Composites/SearchBar",
    component: SearchBar,
    // args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof SearchBar>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
};

