import {  Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import DropMenuCPN from '.';

import type { Props } from '.';

const defaultArgs:Props = {
    items: [
      {
        id: "001",
        label: "Price",
      },
      {
        id: "002",
        label: "Name",
      },
      {
        id: "003",
        label: "Date",
      },
    ]

};


const Wrapper = (args:Props) => {
  const [currentLabel, setCurrentLabel] = useState(args.items[0].label);

  const onChange = (id: string) => {
    const item = args.items.find(item => item.id === id);
    if (item) {
      setCurrentLabel(item.label);
    }
  };

  const argsWithOnChange = {
    ...args,
    onChange,
  };

  return (
    <div style={{ 
      width: "400px",
      backgroundColor: "gray",
      padding: "20px",
      }}>
      <DropMenuCPN {...argsWithOnChange} />
      <div>{currentLabel}</div>
    </div>
  );
};

export default {
  title: "Basics/DropMenuCPN",
  component: Wrapper,
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof DropMenuCPN>;


export const Default: Story = {};

