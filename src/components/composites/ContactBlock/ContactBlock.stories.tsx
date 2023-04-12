import { Meta, StoryObj } from "@storybook/react";

import ContactBlock from ".";
import type { Props } from ".";

const defaultArg: Props = {
  email: "customer.support@example.com",
  phone: "123-456-7890",
  additionalInfos: [
    "We are open from 9am to 5pm, Monday to Friday.",
    "We are closed on weekends and holidays.",
  ],
};

export default {
  title: "Composites/ContactBlock",
  component: ContactBlock,
  args: defaultArg,
} as Meta;

type Story = StoryObj<typeof ContactBlock>;

export const Default: Story = {};
