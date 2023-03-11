import type { StorybookConfig } from "@storybook/nextjs";
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    'storybook-addon-sass-postcss'
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async config => {
    config && config.resolve? config.resolve.plugins = [...(config.resolve.plugins || []), new TsconfigPathsPlugin({
      extensions: config.resolve.extensions
    })]: null;
    return config;
  }
};
export default config;
