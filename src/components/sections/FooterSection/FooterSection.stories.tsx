import { Meta, StoryObj } from "@storybook/react";

import FooterSection from ".";
import type { Props } from ".";

import Logo from "@images/logo.jpg";

const defaultArgs: Props = {
  contactInfo: {
    email: "customer.support@example.com",
    phone: "123456789",
    additionalInfos: ["We are open from 9am to 5pm", "Monday to Friday"],
  },
  aboutText:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt lacinia, nisl nisl aliquam mauris, vitae ultricies nisl nisl eget nisl. Sed euismod, nisl vel tincidunt lacinia, nisl nisl aliquam mauris, vitae ultricies nisl nisl eget nisl.",
  logoImg: {
    src: Logo,
    alt: "Logo",
  },
};

export default {
  title: "Sections/FooterSection",
  component: FooterSection,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof FooterSection>;

export const Default: Story = {
  args: {},
};
