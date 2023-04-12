import { Meta, StoryObj } from "@storybook/react";

import ShippingAddressForm from ".";
import type { Props } from ".";

export default {
  title: "Composites/ShippingAddressForm",
  component: ShippingAddressForm,
  args: {},
} as Meta;

type Story = StoryObj<typeof ShippingAddressForm>;

export const Default: Story = {};
