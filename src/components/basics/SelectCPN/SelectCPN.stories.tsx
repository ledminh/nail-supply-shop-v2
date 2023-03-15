import {  Meta, StoryObj } from "@storybook/react";

import { useState } from "react";

import SelectCPN from '.';

import type { OptionItem } from "@/types/others";

const optionItems:OptionItem[]  = [
  {
    label: "Option 1",
    value: "option1"
  },
  {
    label: "Option 2",
    value: "option2"
  },
  {
    label: "Option 3",
    value: "option3"
  }
]


const Wrapper = () => {

  const [currentOption, setCurrentOption] = useState(optionItems[0]);


  const args = {
    optionItems,
    onChange: (selectedOption: OptionItem) => {
      setCurrentOption(selectedOption);
    }
  };

  return (
    <div style={{
      width: "100%", 
      height: "100vh", 
      display: "flex",
      flexDirection: "column",
      gap: "1rem", 
      justifyContent: "center", 
      alignItems: "center"}}
      >
      <SelectCPN {...args} />
      <div>
        <p>Current Option:</p>
        <p>Label: {currentOption.label}</p>
        <p>Value: {currentOption.value}</p>
      </div>
    </div>
  );
}



export default {
  title: "Basics/SelectCPN",
  component: Wrapper,
} as Meta;




type Story = StoryObj<typeof SelectCPN>;


export const Default: Story = {};

