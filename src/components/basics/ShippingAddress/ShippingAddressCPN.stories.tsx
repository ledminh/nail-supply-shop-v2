import { Meta, StoryObj } from "@storybook/react";

import ShippingAddressCPN from ".";

import type { Props } from ".";

const defaultArgs: Props = {};

export default {
  title: "Basics/ShippingAddressCPN",
  component: ShippingAddressCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ShippingAddressCPN>;

export const Default: Story = {};
