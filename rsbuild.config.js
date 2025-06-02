import path from "node:path";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import Dotenv from "dotenv-webpack";
import { mfConfig } from "./module-federation.config";

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_"] });

export default ({ envMode }) => {
	return defineConfig({
		server: {
			port: 8000,
		},
		source: {
			define: publicVars,
		},
		html: {
			template: path.resolve(__dirname, "./public/index.html"),
			favicon: path.resolve(__dirname, "./public/favicon.ico"),
		},
		tools: {
			rspack: {
				plugins: [
					new ModuleFederationPlugin(mfConfig),
					envMode === "development" &&
						new Dotenv({
							path: "./.env.local", // Path to .env file (this is the default)
							safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
						}),
				].filter(Boolean),
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
};
