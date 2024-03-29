import { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";

import RichTextEditorBlockCPN from ".";

import type { Props } from ".";

const defaultArgs: Partial<Props> = {
  title: "About Us (footer)",
  initContent:
    "Nail Essential is a family-owned business that has been providing high-quality nail care products to professionals and enthusiasts for over 20 years. Our mission is to make it easy for our customers to find the products they need to create beautiful and healthy nails. We take pride in offering a wide selection of top-quality products, competitive pricing, and exceptional customer service. Thank you for choosing Nail Essential for all of your nail care needs.",
  // onSave: (content) => console.log(content)
};

const Wrapper = () => {
  const [content, setContent] = useState<string | null>(null);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RichTextEditorBlockCPN
        title={defaultArgs.title!}
        initContent={defaultArgs.initContent!}
        onSave={(content) => setContent(content)}
      />

      <div style={{ marginTop: "20px" }}>
        <h3>Content:</h3>
        <p>{content ? content : "Nothing here"}</p>
      </div>
    </div>
  );
};

export default {
  title: "Basics/RichTextEditorBlockCPN",
  component: Wrapper,
  args: defaultArgs,
} as Meta;

type Story = StoryObj<typeof RichTextEditorBlockCPN>;

export const Default: Story = {};
