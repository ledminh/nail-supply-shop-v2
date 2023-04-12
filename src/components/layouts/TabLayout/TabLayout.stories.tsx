import { Meta, StoryObj } from "@storybook/react";

import TabLayout from ".";
import type { TabLayoutProps } from ".";

import { adminConfig } from "@/config";

const Children = () => (
  <div
    style={{
      height: "100%",
      width: "100%",
      backgroundColor: "gray",
    }}
  >
    Children
  </div>
);

const { sections } = adminConfig;

const defaultArgs = {
  tabs: sections,
  currentTabSlug: sections[0].slug,
  children: <Children />,
};

export default {
  title: "Layouts/TabLayout",
  component: TabLayout,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof TabLayout>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {};
