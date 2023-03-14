import {  Meta, StoryObj } from "@storybook/react";

import CategoryInfo from '.';
import type { Props } from '.';


const defaultArgs:Props = {
  name: "Category Name",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
  image: {
    src: "https://picsum.photos/300/300",
    alt: "Placeholder image"
  }
}


const Wrapper = (props: Props) => (
  <div style={{
    width: "300px",
    border: "6px solid #ccc"
    }}>
    <CategoryInfo {...props} />
  </div>
);


export default {
  title: "Composites/CategoryInfo",
  component: Wrapper,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof CategoryInfo>;


export const Default: Story = {};

