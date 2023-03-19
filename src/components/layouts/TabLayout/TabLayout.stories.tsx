import {  Meta, StoryObj } from "@storybook/react";

import TabLayout from '.';
import type { Props } from '.';



const defaultArgs:Props = {
};

// const Wrapper = (args:Props) => (
//   <div style={{
    
//   }}>
//     <TabLayout {...args} />
//   </div>
// );


export default {
  title: "Layouts/TabLayout",
  component: TabLayout,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof TabLayout>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {};

