import { dependencies } from "./package.json";
import type { Rspack } from "@rsbuild/core";

export const mfConfig: Rspack.ModuleFederationPluginOptions = {
  name: "host",
  filename: "general.js",
  exposes: {
    "./Api": "./src/general/api",
    // "./Store": "./src/redux/store",
    "./Loader": "./src/general/components/Loader",
    // './GeneralSelect': './src/general/components/GeneralSelect',
    // './OptionsMenu': './src/general/components/OptionsMenu',
    // './menuTypes': './src/general/constants/menuItemsTypes',
    "./getCurrentAppropriateLang":
      "./src/general/utils/getCurrentAppropriateLang",
    "./ReturnBaseUrl": "./src/general/networking/returnBaseUrl",
    "./ApiButton": "./src/general/networking/apiButton",
    "./networking/GeneralInput": "./src/general/networking/generalInput",
    "./networking/NoContent": "./src/general/networking/noContent",
    "./networking/ItemHeader": "./src/general/networking/itemHeader",
    "./networking/CodeSnippet":
      "./src/general/networking/ApiDialog/CodeSnippet",
    "./composeValidators": "./src/general/utils/composeValidators",
    "./isServiceAvailable": "./src/utils/availability",
    "./Popup": "./src/components/ui/generalTooltip",
    "./ErrorScreen": "./src/general/components/ErrorScreen",
    "./Table": "./src/components/ui/table",
    "./Modal": "./src/components/ui/dialog",
    "./DropdownMenu": "./src/components/ui/dropdown-menu",
    "./Button": "./src/components/ui/button",
    "./Form": "./src/components/ui/form",
    "./Input": "./src/components/ui/input",
    "./Tabs": "./src/components/ui/tabs",
    "./Select": "./src/components/ui/select",
    "./Separator": "./src/components/ui/separator",
    "./Radio": "./src/components/ui/radio-group",
    "./Checkbox": "./src/components/ui/checkbox",
    "./Textarea": "./src/components/ui/textarea",
    "./Carousel": "./src/components/ui/carousel",
    "./Tooltip": "./src/components/ui/tooltip",
    "./Label": "./src/components/ui/label",
    "./ReduxTypes": "./src/redux/types",
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
    sonner: {
      singleton: true,
      strictVersion: true,
      requiredVersion: dependencies.sonner,
    },
  },
};
