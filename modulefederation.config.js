const { dependencies } = require("./package.json");

// const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
	name: "host",
	filename: "general.js",
	exposes: {
		"./Api": "./src/general/api.js",
		"./Store": "./src/redux/store.js",
		"./Loader": "./src/general/components/Loader",
		"./GeneralSelect": "./src/general/components/GeneralSelect",
		"./OptionsMenu": "./src/general/components/OptionsMenu",
		"./menuTypes": "./src/general/constants/menuItemsTypes",
		"./getCurrentAppropriateLang":
			"./src/general/utils/getCurrentAppropriateLang",
		"./ReturnBaseUrl": "./src/general/networking/returnBaseUrl.js",
		"./ContentPage": "./src/general/networking/contentPage.js",
		"./ApiButton": "./src/general/networking/apiButton.js",
		"./networking/i18n": "./src/general/networking/i18n.js",
		"./networking/GeneralInput": "./src/general/networking/generalInput.js",
		"./networking/NoContent": "./src/general/networking/noContent.js",
		"./networking/ItemHeader": "./src/general/networking/itemHeader.js",
		"./networking/CodeSnippet":
			"./src/general/networking/ApiDialog/CodeSnippet.js",
		"./composeValidators": "./src/general/utils/composeValidators.js",
		"./isServiceAvailable": "./src/utils/availability.js",
	},
	shared: {
		react: {
			singleton: true, // true - load this module once
			strictVersion: true, // only necessary version
			requiredVersion: dependencies.react, // define required module version
		},
		"react-router-dom": {
			singleton: true,
			strictVersion: true,
			requiredVersion: dependencies["react-router-dom"],
		},
		"react-i18next": {
			singleton: true,
			strictVersion: true,
			requiredVersion: dependencies["react-i18next"],
		},
	},
};
