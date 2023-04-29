import { Meta, StoryObj } from "@storybook/react";

import StripeCheckoutButtonCPN from ".";

import type { Props } from ".";

const defaultArgs: Props = {
  orderedProducts: [],
  shippingAddress: {
    name: "John Doe",
    address1: "123 Main St",
    address2: "Apt 1",
    city: "New York",
    state: "NY",
    zip: "12345",
    email: "johnDoe@example.com"
  }
};

export default {
  title: "Basics/StripeCheckoutButtonCPN",
  component: StripeCheckoutButtonCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof StripeCheckoutButtonCPN>;

export const Default: Story = {};
