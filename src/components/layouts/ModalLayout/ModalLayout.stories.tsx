import { Meta, StoryObj } from "@storybook/react";

import ModalLayout from ".";
import type { Props } from ".";

const defaultArgs: Props = {
  title: "Modal Title",
  children: <div>Modal Content</div>,
  FooterComponent: () => <div>Modal Footer</div>,
  type: "normal",
};


export default {
  title: "Layouts/ModalLayout",
  component: ModalLayout,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof ModalLayout>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Normal: Story = {};
export const Warning: Story = { args: { type: "warning" } };
