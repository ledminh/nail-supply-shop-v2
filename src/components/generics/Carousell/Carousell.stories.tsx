import React from "react";
import {  Meta, StoryObj } from "@storybook/react";

import Carousell from '.';
import type { Props } from '.';

type ItemProps = {
  id: string;
  name: string;
};

const ItemCPN = ({id, name}:ItemProps) => (
  <div style={{
      backgroundColor: "gray",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: "1rem",
    }}>
    Item
  </div>);
 
const items = [
  {
    id: "1",
    name: "Item 1",
  },
  {
    id: "2",
    name: "Item 2",
  },
  {
    id: "3",
    name: "Item 3",
  },
  {
    id: "4",
    name: "Item 4",
  },
  {
    id: "5",
    name: "Item 5",
  },
  {
    id: "6",
    name: "Item 6",
  },
]


const defaultArgs:Props<ItemProps> = {
  items: items,
  initialItemID: "1",
  ItemCPN: ItemCPN,
}


export default {
  title: "Generics/Carousell",
  component: Carousell,
  args: defaultArgs,
} as Meta;




type Story = StoryObj<typeof Carousell>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
};

