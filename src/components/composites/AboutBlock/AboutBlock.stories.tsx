import {  Meta, StoryObj } from "@storybook/react";

import AboutBlock from '.';
import type { Props } from '.';

const defaultArgs:Props = {
  text: "We are a team of developers who are passionate about building great products. We don't kid ourselves, we know we're not perfect, but we're always striving to be better. We're alway open to feedback and we're always looking to improve. We're a small team, but we're a team that's always looking to grow. We're always looking for new talent to join our team. If you're interested in joining our team, please contact us."
}

export default {
  title: "Composites/AboutBlock",
  component: AboutBlock,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof AboutBlock>;


export const Default: Story = {};

