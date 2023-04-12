import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type {
  ListCondition,
  SortItem,
  SortedOrderItem,
} from "@/types/list-conditions";

import SortAndOrder from ".";

const defaultArgs = {
  sortItems: [
    {
      label: "Price",
      value: "price",
    },
    {
      label: "Name",
      value: "name",
    },
  ],
  sortedOrderItems: [
    {
      label: "Ascending",
      value: "asc",
    },
    {
      label: "Descending",
      value: "desc",
    },
  ],
  initCondition: {
    sort: {
      label: "Name",
      value: "name",
    },
    sortedOrder: {
      label: "Descending",
      value: "desc",
    },
  },
} as {
  sortItems: SortItem[];
  sortedOrderItems: SortedOrderItem[];
  initCondition?: ListCondition;
};

const Wrapper = () => {
  const [currentCondition, setCurrentCondition] =
    useState<ListCondition | null>(null);

  const onChange = (condition: ListCondition) => {
    setCurrentCondition(condition);
  };

  const args = {
    ...defaultArgs,
    onChange,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SortAndOrder {...args} />
      <div>
        <p>Current Condition:</p>
        <p>Sort: {currentCondition?.sort?.label}</p>
        <p>Order: {currentCondition?.sortedOrder?.label}</p>
      </div>
    </div>
  );
};
export default {
  title: "Composites/SortAndOrder",
  component: Wrapper,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof SortAndOrder>;

export const Default: Story = {
  args: {},
};
