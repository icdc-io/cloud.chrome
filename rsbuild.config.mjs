import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import Dotenv from "dotenv-webpack";
import mfConfig from "./modulefederation.config";

const ENV_PATTERN = /REACT_APP_/;
const stringifiedEnvVars = JSON.stringify(
  Object.keys(process.env)
    .filter((key) => ENV_PATTERN.test(key))
    .reduce((acc, curr) => {
      acc[curr] = process.env[curr];
      return acc;
    }, {}),
);

export default defineConfig({
  server: {
    port: 8000,
  },
  mode: process.env.NODE_ENV,
  tools: {
    rspack: (config, { appendPlugins, rspack }) => {
      config.context = __dirname;
      appendPlugins([
        new ModuleFederationPlugin(mfConfig),
        new rspack.DefinePlugin(stringifiedEnvVars),
        new Dotenv({
          path: "./.env.local", // Path to .env file (this is the default)
          safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
        }),
      ]);
    },
  },
  plugins: [
    pluginReact({
      splitChunks: {
        router: false,
        react: false,
      },
    }),
    pluginSass(),
  ],
});
