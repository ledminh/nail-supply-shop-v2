import { Meta, StoryObj } from "@storybook/react";

import WebsiteTitleCPN from ".";

import { websiteTitle } from "@/config";

export default {
  title: "Basics/WebsiteTitleCPN",
  component: WebsiteTitleCPN,
  args: websiteTitle,
} as Meta;

type Story = StoryObj<typeof WebsiteTitleCPN>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {};
