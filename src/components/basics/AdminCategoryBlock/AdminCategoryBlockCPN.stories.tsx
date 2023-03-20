import {  Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import AdminCategoryBlockCPN from '.';

import type { Props } from '.';



const defaultArgs = {
  id: "1",
  name: "Category Sample",
  image: {
    src: "https://loremflickr.com/300/300",
    alt: "Category Image",
  },
  description: "This is a sample category for testing purposes. Don't take it seriously. It's just a sample. Another sample. Only another sample",
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
      <AdminCategoryBlockCPN {...args} />
      <p>{onClickText}</p>
      <p>{onDeleteText}</p>
    </>
  )
    
};
  



export default {
  title: "Basics/AdminCategoryBlockCPN",
  component: Wrapper,
  args: {}
} as Meta;




type Story = StoryObj<typeof AdminCategoryBlockCPN>;


export const Default: Story = {};

