import { Meta, StoryObj } from "@storybook/react";

import ButtonCPN from ".";

import { Props } from ".";

const defaultArgs: Props = {
  type: "normal",
  label: "Button",
  onClick: () => {},
};

export default {
  title: "Basics/ButtonCPN",
  component: ButtonCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ButtonCPN>;

export const Normal: Story = {};

export const Attention: Story = {
  args: {
    type: "attention",
  },
};

export const Danger: Story = {
  args: {
    type: "danger",
  },
};

export const IconLeft: Story = {
  args: {
    icon: {
      position: "left",
      Node: <span>Icon</span>,
    },
  },
};

export const IconRight: Story = {
  args: {
    icon: {
      position: "right",
      Node: <span>Icon</span>,
    },
  },
};
