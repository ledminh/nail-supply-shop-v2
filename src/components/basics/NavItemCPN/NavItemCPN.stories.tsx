import {  Meta, StoryObj } from "@storybook/react";

import NavItemCPN from ".";
import type { Props } from ".";

const defaultArgs: Props = {
    label: "Link 1",
};

export default {
    title: "Basics/NavigationItemCPN",
    component: NavItemCPN,
    args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof NavItemCPN>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
};

