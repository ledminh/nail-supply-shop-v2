import {  Meta, StoryObj } from "@storybook/react";

import ProductList from '.';
import type { Props } from '.';


const productSample = {
  id: "1",
  name: "Product Name",
  price: 100,
  intro: "This is some intro text. I'm trying to make it longer to see if it fit on the frame",
  images: [
    {
      id: "img-1",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 1"
    },
    {
      id: "img-2",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 2"
    },
    {
      id: "img-3",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 3"
    }
  ]
}

const productSamples = [
  {
    ...productSample,
    id: "1"
  },
  {
    ...productSample,
    id: "2"
  },
  {
    ...productSample,
    id: "3"
  },
  {
    ...productSample,
    id: "4"
  },
  {
    ...productSample,
    id: "5"
  }
]


const defaultArgs:Props = {
  products: productSamples
};

export default {
  title: "Composites/ProductList",
  component: ProductList,
  args: defaultArgs 
} as Meta;




type Story = StoryObj<typeof ProductList>;


export const Default: Story = {
  args: {

  }
};

