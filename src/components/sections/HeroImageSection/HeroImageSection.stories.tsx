import {  Meta, StoryObj } from "@storybook/react";

import HeroImageSection from '.';
import type { Props } from '.';

import heroImage from "@images/hero_image.png";

const defaultProps: Props = {
  heroImage: heroImage,
  alt: "Hero Image",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eu aliquet nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, eu aliquet nisl nisl eu nisl."
}



export default {
  title: "Sections/HeroImage",
  component: HeroImageSection,
  args: defaultProps
} as Meta;




type Story = StoryObj<typeof HeroImageSection>;


export const Default: Story = {
  args: {

  }
};

