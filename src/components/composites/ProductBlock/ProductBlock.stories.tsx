import {  Meta, StoryObj } from "@storybook/react";

import ProductBlock from '.';
import type { Props } from '.';

const defaultArgs:Props = {
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
  ]
};

const Wrapper = () => {

  return (
    <div style={{
      width: "30vw",


    }}>
      <ProductBlock {...defaultArgs} />
    </div>
  );
}




export default {
  title: "Composites/ProductBlock",
  component: Wrapper,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof ProductBlock>;


export const Default: Story = {};

