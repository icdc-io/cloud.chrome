import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import Dotenv from "dotenv-webpack";
import { mfConfig } from "./module-federation.config";

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_"] });
const PORT = 8000;

export default defineConfig({
	server: {
		port: PORT,
		host: "0.0.0.0",
	},
	dev: {
		assetPrefix: true,
		client: {
			host: "localhost",
			port: PORT,
			protocol: "ws",
		},
		hmr: true,
		lazyCompilation: false,
	},
	source: {
		define: publicVars,
	},
	tools: {
		rspack: (config, { appendPlugins, isDev }) => {
			config.output.publicPath = "auto";
			if (config.output) config.output.publicPath = "auto";
			const plugins = [
				new ModuleFederationPlugin(mfConfig),
				isDev &&
					new Dotenv({
						path: "./.env.local", // Path to .env file (this is the default)
						safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
					}),
			].filter(Boolean);
			appendPlugins(plugins);
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
