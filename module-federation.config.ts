import type { Rspack } from "@rsbuild/core";
import { dependencies } from "./package.json";

export const mfConfig: Rspack.ModuleFederationPluginOptions = {
	name: "host",
	filename: "general.js",
	exposes: {
		"./Api": "./src/shared/api/shared",
		// "./Store": "./src/redux/store",
		"./Loader": "./src/shared/ui/loader",
		// './GeneralSelect': './src/general/components/GeneralSelect',
		// './OptionsMenu': './src/general/components/OptionsMenu',
		// './menuTypes': './src/general/constants/menuItemsTypes',
		"./getCurrentAppropriateLang": "./src/shared/lib/getCurrentAppropriateLang",
		"./ReturnBaseUrl": "./src/shared/lib/returnBaseUrl",
		"./ApiButton": "./src/widgets/apiButton",
		"./GeneralInput": "./src/shared/ui/generalInput",
		"./NoContent": "./src/shared/ui/noContent",
		"./CodeSnippet": "./src/shared/ui/ApiDialog/CodeSnippet",
		"./composeValidators": "./src/shared/lib/composeValidators",
		"./isServiceAvailable": "./src/shared/lib/availability",
		"./Popup": "./src/shared/ui/generalTooltip",
		"./ErrorScreen": "./src/shared/ui/ErrorScreen",
		"./Table": "./src/shared/ui/table",
		"./Modal": "./src/shared/ui/dialog",
		"./DropdownMenu": "./src/shared/ui/dropdown-menu",
		"./Button": "./src/shared/ui/button",
		"./Form": "./src/shared/ui/form",
		"./Input": "./src/shared/ui/input",
		"./Tabs": "./src/shared/ui/tabs",
		"./Select": "./src/shared/ui/select",
		"./Separator": "./src/shared/ui/separator",
		"./Radio": "./src/shared/ui/radio-group",
		"./Checkbox": "./src/shared/ui/checkbox",
		"./Textarea": "./src/shared/ui/textarea",
		"./Carousel": "./src/shared/ui/carousel",
		"./Tooltip": "./src/shared/ui/tooltip",
		"./Label": "./src/shared/ui/label",
		"./ReduxTypes": "./src/redux/types",
		"./roleUtils": "./src/shared/lib/roleUtils",
		"./ReduxActions": "./src/redux/shared",
		"./Langs": "./src/shared/translations/langs",
		"./Segment": "./src/shared/ui/segment",
		"./Paginator": "./src/shared/ui/Paginator",
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
		"@tanstack/react-query": {
			singleton: true,
			strictVersion: true,
			requiredVersion: dependencies["@tanstack/react-query"],
		},
	},
};
