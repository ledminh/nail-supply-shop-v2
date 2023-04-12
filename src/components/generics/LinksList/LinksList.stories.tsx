import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import LinksList, { Props } from ".";
import { LinkItem } from "@/types/item";

interface ExampleLinkItem extends LinkItem {
  name: string;
}

const ExampleLinkItemComponent: React.FC<ExampleLinkItem> = ({ id, name }) => (
  <div>
    <p>{id}</p>
    <p>{name}</p>
  </div>
);

const defaultItems: ExampleLinkItem[] = [
  { id: "1", name: "Link 1", path: "https://www.example.com/link-1" },
  { id: "2", name: "Link 2", path: "https://www.example.com/link-2" },
  { id: "3", name: "Link 3", path: "https://www.example.com/link-3" },
];

const defaultArgs: Props<ExampleLinkItem> = {
  items: defaultItems,
  ItemCPN: ExampleLinkItemComponent,
  liClass: "",
  ulClass: "",
  linkClass: "",
};

export default {
  title: "Generics/LinksList",
  component: LinksList,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof LinksList>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {};
