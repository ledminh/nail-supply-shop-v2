import { Meta, StoryObj } from "@storybook/react";

import ShippingAddressCPN from ".";

import type { Props } from ".";

const defaultArgs: Props = {
  shippingAddress: {
    name: "John Doe",
    address1: "123 Main St",
    address2: "Apt 1",
    city: "New York",
    state: "NY",
    zip: "12345",
    email: "johndoe@example.com"
  }
};

export default {
  title: "Basics/ShippingAddressCPN",
  component: ShippingAddressCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ShippingAddressCPN>;

export const Default: Story = {};
