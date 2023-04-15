import { Meta, StoryObj } from "@storybook/react";

import ShippingAddressCPN from ".";

import type { Props } from ".";

const defaultArgs: Props = {
  shippingAddress: {
    name: 'Tester',
    address1: '123 Main St',
    address2: 'Apt 1',
    city: 'Testville',
    state: 'TX',
    zip: '12345',
    email: 'email@test.com'
  }
};

export default {
  title: "Basics/ShippingAddressCPN",
  component: ShippingAddressCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ShippingAddressCPN>;

export const Default: Story = {};
