import {  Meta, StoryObj } from "@storybook/react";

import OrderDetail from '.';
import type { Props } from '.';

const defaultArgs = {
  orderedProducts: [
    {
      id: "1",
      name: "Product 1",
      price: 100,
      quantity: 2
    },
    {
      id: "2",
      name: "Product 2",
      price: 200,
      quantity: 3
    },
    {
      id: "3",
      name: "Product 3",
      price: 300,
      quantity: 4
    }
  ]
};


export default {
  title: "Composites/OrderDetail",
  component: OrderDetail,
  args: defaultArgs
} as Meta;



type Story = StoryObj<typeof OrderDetail>;


export const Default: Story = {
  args: {

  }
};

