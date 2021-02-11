import webpack from "webpack";
import { join } from "path";
import { rootFolder } from "../paths.js";
import { buildFolder } from "../paths.js";
import ErrorOverlayPlugin from "error-overlay-webpack-plugin";

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
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true, url: false },
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
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ErrorOverlayPlugin(),
  ],
  devtool: 'cheap-module-source-map',
});

export const productionCompiler = webpack(config('production'));

export const developmentCompiler = webpack(config('development'));
