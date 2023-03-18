import {  Meta, StoryObj } from "@storybook/react";

import ImagesCarousellSection from '.';
import type { Props } from '.';
import { ProductImage } from "@/types/product";

const images:ProductImage[] = [
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
  },
  {
    id: "img-4",
    src: "https://picsum.photos/seed/picsum/200/200",
    alt: "Product Image 4"
  },
  {
    id: "img-5",
    src: "https://picsum.photos/seed/picsum/200/200",
    alt: "Product Image 5"
  },
]


const defaultArgs:Props = {
  images,
  initialImageID: images[0].id
}


export default {
  title: "Sections/ImagesCarousellSection",
  component: ImagesCarousellSection,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof ImagesCarousellSection>;


export const Default: Story = {};

