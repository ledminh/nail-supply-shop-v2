import { Meta, StoryObj } from "@storybook/react";

import TableLayout from ".";
import type { Props } from ".";

const header = {
  key: "header",
  cells: [
    {
      key: "empty",
      value: "",
    },
    {
      key: "price",
      value: "Price",
    },
    {
      key: "quantity",
      value: "Quantity",
    },
    {
      key: "total",
      value: "Total",
    },
  ],
};

const getRow = (
  name: string,
  price: number,
  quantity: number,
  total: number
) => {
  return {
    key: name,
    cells: [
      {
        key: "name",
        value: name,
      },
      {
        key: "price",
        value: price + "",
      },
      {
        key: "quantity",
        value: quantity + "",
      },
      {
        key: "total",
        value: total + "",
      },
    ],
  };
};

const rows = [
  getRow("John", 100, 2, 200),
  getRow("Mary", 200, 3, 600),
  getRow("Peter", 300, 4, 1200),
];

const footer = {
  key: "footer",
  cells: [
    {
      key: "empty_1",
      value: "",
    },
    {
      key: "empty_2",
      value: "",
    },
    {
      key: "total",
      value: "Total",
    },
    {
      key: "total",
      value: "5400",
    },
  ],
};

const defaultArgs: Props = {
  header,
  rows,
  footer,
};

// const Wrapper = (args:Props) => (
//   <div style={{

//   }}>
//     <TableLayout {...args} />
//   </div>
// );

export default {
  title: "Layouts/TableLayout",
  component: TableLayout,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof TableLayout>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {};
