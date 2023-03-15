import {  Meta, StoryObj } from "@storybook/react";

import { useState } from "react";

import SelectCPN from '.';

import type { SelectOptionItem } from "@/types/list-conditions";

const optionItems:SelectOptionItem[]  = [
  {
    label: "Name",
    value: "name"
  },
  {
    label: "Price",
    value: "price"
  },
  {
    label: "Ascending",
    value: "asc"
  }
]


const Wrapper = () => {

  const [currentOption, setCurrentOption] = useState(optionItems[0]);


  const args = {
    optionItems,
    onChange: (selectedOption: SelectOptionItem) => {
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

