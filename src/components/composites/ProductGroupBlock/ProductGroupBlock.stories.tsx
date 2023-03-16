import {  Meta, StoryObj } from "@storybook/react";

import ProductBlock from '.';
import type { Props } from '.';

import { useState } from "react";

import type { OrderedProduct } from "@/types/product";

const defaultArgs = {
  id: 'product-1',
  name: "Product Name",
  price: 100,
  images: [
    {
      src: "https://loremflickr.com/300/300",
      alt: "Product Image",
    },
    {
      src: "https://loremflickr.com/300/300",
      alt: "Product Image",
    },
    {
      src: "https://loremflickr.com/300/300",
      alt: "Product Image",
    },
    {
      src: "https://loremflickr.com/300/300",
      alt: "Product Image",
    },
    {
      src: "https://loremflickr.com/300/300",
      alt: "Product Image",
    }
  ],
  
} as Props;

const Wrapper = () => {
  const [cart, setCart] = useState<OrderedProduct[]>([]);

  const args = {
    ...defaultArgs,
    addToCart: (orderedProduct: OrderedProduct) => {
      setCart([...cart, orderedProduct]);
    },
  };



  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "row",
      gap: "1rem",
      justifyContent: "center",
      alignItems: "center"
    }}
    >
      <div style={{
        width: "30vw",
      }}>
        <ProductBlock {...args} />
      </div>
      <div style={{
        width: "60vw",
      }}>
        {
          cart.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <p>{item.price}</p>
              <p>{item.quantity}</p>
            </div>
          ))

        }
        </div>
    </div>
  );
}




export default {
  title: "Composites/ProductGroupBlock",
  component: Wrapper,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof ProductBlock>;


export const Default: Story = {};

