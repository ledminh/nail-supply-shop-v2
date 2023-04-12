import { Meta, StoryObj } from "@storybook/react";

import ImageCPN from ".";

import type { Props } from ".";

import heroImage from "@images/hero_image.png";

const defaultArgs = {
  image: {
    src: "https://picsum.photos/id/237/200/300",
    alt: "Remote Image",
  },
  sizes: "(max-width: 600px) 100vw, 1200px",
} as Props;

export default {
  title: "Basics/ImageCPN",
  component: ImageCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ImageCPN>;

export const RemoteImage: Story = {};
export const LocalImage: Story = {
  args: {
    image: {
      src: heroImage,
      alt: "Local Image",
    },
  },
};
