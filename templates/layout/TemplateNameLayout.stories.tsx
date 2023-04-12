import { Meta, StoryObj } from "@storybook/react";

import templatenameLayout from ".";
import type { Props } from ".";

const defaultArgs: Props = {};

// const Wrapper = (args:Props) => (
//   <div style={{

//   }}>
//     <templatenameLayout {...args} />
//   </div>
// );

export default {
  title: "Layouts/templatenameLayout",
  component: templatenameLayout,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof templatenameLayout>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {};
