import type { Meta, StoryObj } from '@storybook/react';

import List, { Props } from ".";
import { Item } from "@/types";

// Define the item type for this story
interface ExampleItem extends Item {
  name: string;
}

// Define the component that will render each item in the list
const ExampleItemComponent: React.FC<ExampleItem> = ({ id, name }) => (
  <div>
    <p>{id}</p>
    <p>{name}</p>
  </div>
);

// Define the props and default items to use in the story
const defaultItems: ExampleItem[] = [
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
];

const defaultArgs: Props<ExampleItem> = {
    items: defaultItems,
    ItemCPN: ExampleItemComponent,
    liClass: "",
    ulClass: "",
};

// Define the story
export default {
    title: "Generics/List",
    component: List,
    args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof List>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
};


