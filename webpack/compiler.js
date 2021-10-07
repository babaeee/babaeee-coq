import webpack from "webpack";
import { join } from "path";
import { rootFolder } from "../paths.js";
import { buildFolder } from "../paths.js";
import ErrorOverlayPlugin from "error-overlay-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config = (mode) => ({
  mode,
  entry: {
    bundle: join(rootFolder, 'index.js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.v$/,
        type: 'asset/source',
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { 
                auto: (x) => { return !x.endsWith('.notmodule.css'); },
                localIdentName: '[contenthash:base64]'
              },
              url: false,
            },
          },
        ],
      },
      {
        test: /\.ya?ml$/,
        use: [ 'json-loader', 'yaml-loader' ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  output: {
    path: join(buildFolder, 'dist'),
    filename: 'app.[contenthash].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ErrorOverlayPlugin(),
    new HtmlWebpackPlugin({
      template: join(rootFolder, 'index.html'),
      filename: join(buildFolder, 'index.html'),
    }),
  ],
  devtool: 'cheap-module-source-map',
});

export const productionCompiler = webpack(config('production'));

export const developmentCompiler = webpack(config('development'));
