import { Meta, StoryObj } from "@storybook/react";

import { orderStatus } from "@/config";

import OrderBlock from ".";
import type { Props } from ".";

const defaultArgs: Props = {
  order: {
    id: "112222233456",
    orderedProducts: [
      {
        id: "1",
        name: "Product 1",
        price: 10,
        quantity: 1,
        image: {
          src: "https://picsum.photos/300/300",
          alt: "Product 1",
        },
      },
      {
        id: "2",
        name: "Product 2",
        price: 20,
        quantity: 2,
        image: {
          src: "https://picsum.photos/300/300",
          alt: "Product 2",
        },
      },
      {
        id: "3",
        name: "Product 3",
        price: 30,
        quantity: 3,
        image: {
          src: "https://picsum.photos/300/300",
          alt: "Product 3",
        },
      },
    ],
    shippingAddress: {
      name: "John",
      address1: "123 Main St",
      address2: "Apt 1",
      city: "New York",
      state: "NY",
      zip: "10001",
      email: "something@example.com",
    },
    status: {
      lastUpdated: "2021-01-01",
      value: "processing",
      description: orderStatus.processing,
    },
  },
  onStatusChange: () => {},
  onOrderDelete: () => {},
};

export default {
  title: "Composites/OrderBlock",
  component: OrderBlock,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof OrderBlock>;

export const Default: Story = {
  args: {},
};
