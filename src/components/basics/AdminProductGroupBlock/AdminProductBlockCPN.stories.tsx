import {  Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import AdminProductBlockCPN from '.';

import type { Props } from '.';



const defaultArgs = {
  id: "1",
  name: "Product Sample",
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
  ],
  intro: "This is a sample productfor testing purposes. Don't take it seriously. It's just a sample. Another sample. Only another sample",
} as Props;



const Wrapper = () => {

  const [onClickText, setOnClickText] = useState("");
  const [onDeleteText, setOnDeleteText] = useState("");

  const args = defaultArgs;

  args.onClick = (catID: string) => {
    setOnClickText(`Clicked on ${catID}`);
  };

  args.onDelete = (catID: string) => {
    setOnDeleteText(`Deleted ${catID}`);
  };



  return (
    <>
      <AdminProductBlockCPN {...args} />
      <p>{onClickText}</p>
      <p>{onDeleteText}</p>
    </>
  )
    
};
  



export default {
  title: "Basics/AdminProductBlockCPN",
  component: Wrapper,
  args: {}
} as Meta;




type Story = StoryObj<typeof AdminProductBlockCPN>;


export const Default: Story = {};

