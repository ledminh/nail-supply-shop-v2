import {  Meta, StoryObj } from "@storybook/react";

import ProductBlock from '.';
import { ProductGroup, Product } from "@/types/product";
import { RemoteImage } from "@/types/image";
import { useState } from "react";

import type { OrderedProduct } from "@/types/product";


const images:RemoteImage[] = [
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
]


const products = [
  {
    id: "1",
    name: "Product 1",
    price: 10,
    images: images.map((img,index) => ({...img, id: index.toString()}))
  },
  {
    id: "2",
    name: "Product 2",
    price: 20,
    images: images.map((img,index) => ({...img, id: index.toString()}))
  },
  {
    id: "3",
    name: "Product 3",
    price: 30,
    images: images.map((img,index) => ({...img, id: index.toString()}))
  },
  {
    id: "4",
    name: "Product 4",
    price: 40,
    images: images.map((img,index) => ({...img, id: index.toString()}))
  },
  {
    id: "5",
    name: "Product 5",
    price: 50,
    images: images.map((img,index) => ({...img, id: index.toString()}))
  },
  {
    id: "6",
    name: "Product 6",
    price: 60,
    images: images.map((img,index) => ({...img, id: index.toString()}))
  }
] as Product[];
      
const defaultArgs:ProductGroup = {
  id: "group-1",
  name: "Product Group",
  products,
}


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
        width: "35vw",
      }}>
        <ProductBlock {...args} />
      </div>
      <div style={{
        width: "50vw",
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