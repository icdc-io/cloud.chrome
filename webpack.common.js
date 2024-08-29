const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const { ContextReplacementPlugin } = require('webpack');
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies } = require("./package.json");
const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: path.resolve(__dirname, "src", "bootstrap.js"),
  output: {
    filename: "[name].[contenthash]-init.js",
    chunkFilename: "[name].[contenthash]-async.js",
    publicPath: isEnvProduction ? "/" : "/",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.inline.svg$/,
        use: "@svgr/webpack",
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|jpg|jpeg|gif|otf|svg)$/i,
        type: "asset",
        exclude: /\.inline.svg$/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
      favicon: "public/favicon.ico",
    }),
    new HtmlWebpackPlugin({
      filename: "silent-check-sso.html",
      template: "public/silent-check-sso.html",
      inject: false,
    }),
    // new ContextReplacementPlugin(/moment[/\\]locale$/, /(en-gb)$/),
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
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
        "semantic-ui-react": {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies["seamless-ui-react"],
        },
        "react-redux": {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies["react-redux"],
        },
      },
    }),
  ],
};
