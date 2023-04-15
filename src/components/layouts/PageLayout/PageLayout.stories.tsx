import { Meta, StoryObj } from "@storybook/react";

import PageLayout from ".";
import type { Props } from ".";
import Logo from "@images/logo.jpg";

const SampleContent = () => (
  <div
    style={{
      height: "60vh",
      width: "100%",
      backgroundColor: "gray",
    }}
  >
    <h1>Sample Content</h1>
  </div>
);

const defaultArgs: Props = {
  contactInfo: {
    email: "customer.service@example.com",
    phone: "123456789",
    additionalInfos: [
      "Address: 123 Street, City, Country",
      "Opening hours: 9am - 5pm",
    ],
  },
  aboutText:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl sit amet nisl. Sed euismod, nisl vitae ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl sit amet nisl.",
  children: <SampleContent />,
};

export default {
  title: "Layouts/PageLayout",
  component: PageLayout,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof PageLayout>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {};
