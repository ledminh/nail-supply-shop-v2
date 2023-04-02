import {  Meta, StoryObj } from "@storybook/react";

import OrderList from '.';
import type { Props } from '.';
import { Order, StatusValue } from "@/types/order";
import { orderStatus } from "@/config";

const order:Order = {
  id: "1",
  orderedProducts: [
    {
      id: "1",
      name: "Product 1",
      price: 10,
      quantity: 1,
      image: {
        src: "https://picsum.photos/300/300",
        alt: "Product 1"
      }
    },
    {
      id: "2",
      name: "Product 2",
      price: 20,
      quantity: 2,
      image: {
        src: "https://picsum.photos/300/300",
        alt: "Product 2"
      }
    }
  ],
  shippingAddress: {
    name: "John Doe",
    address1: "123 Main St",
    address2: "Apt 1",
    city: "New York",
    state: "NY",
    zip: "10001",
    email: "johndoe@example.com"
  },
  status: {
    value: "processing",
    lastUpdated: "2021-01-01",
    description: orderStatus["processing"]
  }
} 



const orders:Order[] = [
  {
    ...order,
    id: "1",
  },
  {
    ...order,
    id: "2",
    shippingAddress: {
      name: "John Doe",
      address1: "333 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      email: "n@yahoo.com"
    },
  },
  {
    ...order,
    id: "3",
  },
  {
    ...order,
    id: "4",
  },
]


const defaultArgs:Props = {
  orders: orders,
  onStatusChange: (id:string, status:StatusValue) => {},
  onOrderDelete: (id:string) => {}
}


export default {
  title: "Composites/OrderList",
  component: OrderList,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof OrderList>;


export const Default: Story = {};