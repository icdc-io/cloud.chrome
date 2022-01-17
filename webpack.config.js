const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { dependencies } = require("./package.json");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

let mode = 'development';

if (process.env.NODE_ENV === 'production') {
  mode = 'production'
}

module.exports = {
  mode,
  entry: './src/index',
  // output: {
  //   filename: '[name].[contenthash].js',
  //   assetModuleFilename: 'assets/[hash][ext][query]',
  //   publicPath: "http://localhost:8081",
  //   clean: true
  // },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          (mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader),
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude:
          /node_modules/,
        use: {
          loader:
            'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-env',
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
            ],
          },
        },
      },
      {
        test: /\.(png|svg|jp(e)g|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|ttf|eot|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new ModuleFederationPlugin({
      name: 'microFrontEnd1',
      library: { type: 'var', name: 'microFrontEnd1' },
      filename: 'remoteEntry.js',
      exposes: {
        './MicroFrontEnd1Index': './src/wrapper.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
        "semantic-ui-react": {
          singleton: true,
          requiredVersion: dependencies["semantic-ui-react"],
        }
      },
    }),
    new HtmlWebpackPlugin({
      template:
        './public/index.html',
    }),
  ],
  devServer: {
    port: 8081,
    historyApiFallback: true,
    // static: {
    //   directory: path.join(__dirname, "dist"),
    // }
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ],
    concatenateModules: false,
  },
};
