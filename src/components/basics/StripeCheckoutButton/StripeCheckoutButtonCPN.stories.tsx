import { Meta, StoryObj } from "@storybook/react";

import StripeCheckoutButtonCPN from ".";

import type { Props } from ".";

const defaultArgs: Props = {};

export default {
  title: "Basics/StripeCheckoutButtonCPN",
  component: StripeCheckoutButtonCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof StripeCheckoutButtonCPN>;

export const Default: Story = {};
