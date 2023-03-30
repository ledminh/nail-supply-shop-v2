import {  Meta, StoryObj } from "@storybook/react";

import TableLayout from '.';
import type { Props } from '.';

const header = [
  {
      key: "empty",
      label: "",
  },
  {
      key: 'price',
      label: 'Price',
  },
  {
      key: 'quantity',
      label: 'Quantity',
  },
  {
      key: "total",
      label: "Total",
  },
];

const rows = [
  ['John', "100", "2", "200"],
  ['Mary', "200", "3", "600"],
  ['Peter', "300", "4", "1200"],
];

const footer = [
  "", "", 'Total', "5400"
]

const defaultArgs:Props = {
  header,
  rows,
  footer
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
  args: defaultArgs
} as Meta;




type Story = StoryObj<typeof TableLayout>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {};

