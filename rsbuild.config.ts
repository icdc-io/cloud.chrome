import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import Dotenv from "dotenv-webpack";
import { mfConfig } from "./module-federation.config";

const ENV_PATTERN = /REACT_APP_/;
const stringifiedEnvVars = Object.keys(process.env)
  .filter((key) => ENV_PATTERN.test(key))
  .reduce((acc, curr) => {
    acc[curr] = JSON.stringify(process.env[curr]);
    return acc;
  }, {});

export default defineConfig({
  server: {
    port: 8000,
  },
  source: {
    define: {
      ...stringifiedEnvVars,
    },
  },
  // mode: process.env.NODE_ENV,
  tools: {
    rspack: {
      plugins: [
        new ModuleFederationPlugin(mfConfig),
        new Dotenv({
          path: "./.env.local", // Path to .env file (this is the default)
          safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
        }),
      ],
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
