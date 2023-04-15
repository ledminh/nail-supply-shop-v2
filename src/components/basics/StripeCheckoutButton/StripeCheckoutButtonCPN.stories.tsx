import { Meta, StoryObj } from "@storybook/react";

import StripeCheckoutButtonCPN from ".";

import type { Props } from ".";

const defaultArgs: Props = {
  orderedProducts: [],
  shippingAddress: {
    name: "John Doe",
    address1: "123 Main St",
    address2: "Apt 1",
    city: "Testville",
    state: "TX",
    zip: "12345",
    email: "john@test.com",
  }
};

export default {
  title: "Basics/StripeCheckoutButtonCPN",
  component: StripeCheckoutButtonCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof StripeCheckoutButtonCPN>;

export const Default: Story = {};
