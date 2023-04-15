import { Meta, StoryObj } from "@storybook/react";

import QuantityPickerCPN from ".";

import { useState } from "react";

import type { Props } from ".";

const defaultArgs: Props = {
  value: 1,
};

const Wrapper = (args: Props) => {
  const [value, setValue] = useState(args.value);

  const onChange = (value: number) => {
    setValue(value);
  };

  args.onChange = onChange;

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
      <QuantityPickerCPN {...args} />
      <div>
        <p>Current Value: {value}</p>
      </div>
    </div>
  );
};

export default {
  title: "Basics/QuantityPickerCPN",
  component: QuantityPickerCPN,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof QuantityPickerCPN>;

export const Default: Story = {};
