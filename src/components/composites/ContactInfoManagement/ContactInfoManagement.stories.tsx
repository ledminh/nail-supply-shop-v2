import {  Meta, StoryObj } from "@storybook/react";

import ContactInfoManagement from '.';
import type { Props } from '.';


const defaultArgs = {
  initialEmail: "customer.service@gmail.com",
  initialPhone: "0123456789",
  initialAdditionalInfos: ["additional info 1", "additional info 2"],
  onSave: (email: string, phone: string, additionalInfos: string[]) => {
    console.log("email: ", email);
    console.log("phone: ", phone);
    console.log("additionalInfos: ", additionalInfos);
  }
} as Props;

export default {
  title: "Composites/ContactInfoManagement",
  component: ContactInfoManagement,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof ContactInfoManagement>;


export const Default: Story = {
  args: {

  }
};

