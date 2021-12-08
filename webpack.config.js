const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { dependencies } = require("./package.json");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index',
  module: {
    rules: [
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
        test: /\.(scss|css)$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                },
            },
            'css-loader',
            'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
          }
        }]
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
    static: {
      directory: path.join(__dirname, "dist"),
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ],
    concatenateModules: false,
  },
};
