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
    }),
    // new ContextReplacementPlugin(/moment[/\\]locale$/, /(en-gb)$/),
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "host",
      filename: "general.js",
      remotes: {},
      exposes: {
        "./Api": "./src/general/api.js",
        "./Store": "./src/redux/store.js",
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies.react,
          eager: true,
        },
        // "react-redux": {
        //   singleton: true,
        //   strictVersion: true,
        //   requiredVersion: dependencies["react-redux"],
        //   eager: true,
        // },
        // "react-router-dom": {
        //   singleton: true,
        //   strictVersion: true,
        //   requiredVersion: dependencies["react-router-dom"],
        //   eager: true,
        // },
        "react-i18next": {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies["react-i18next"],
          eager: true,
        },
        // "seamless-immutable": {
        //   singleton: true,
        //   strictVersion: true,
        //   requiredVersion: dependencies["seamless-immutable"],
        //   eager: true,
        // },
        "semantic-ui-react": {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies["semantic-ui-react"],
          eager: true,
        },
      },
    }),
  ],
};
