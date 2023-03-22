import {  Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { RemoteImage } from "@/types/image";
import { Product, ProductGroup } from "@/types/product";

import AdminProductGroupBlockCPN from '.';


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
  categoryID: "1",
  products,
}


const Wrapper = () => {

  const [onClickText, setOnClickText] = useState("");
  const [onDeleteText, setOnDeleteText] = useState("");
  const [onEditProductText, setOnEditProductText] = useState("");
  const args = {
    ...defaultArgs,
    onClick: (groupID: string) => {
      setOnClickText(`Clicked on group ${groupID}`);
    },
    onDelete: (groupID: string) => {
      setOnDeleteText(`Deleted ${groupID}`);
    },
    onEditProduct: (productID: string) => {
      setOnEditProductText(`Edited on product: ${productID}`);
    }
  }


  return (
    <>
      <AdminProductGroupBlockCPN {...args} />
      <p>{onClickText}</p>
      <p>{onDeleteText}</p>
      <p>{onEditProductText}</p>
    </>
  )
    
};
  

export default {
  title: "Basics/AdminProductGroupBlockCPN",
  component: Wrapper,
  args: {}
} as Meta;


type Story = StoryObj<typeof AdminProductGroupBlockCPN>;


export const Default: Story = {};