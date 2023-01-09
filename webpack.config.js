const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || 'development';

const devMode = mode === 'development';

const target = devMode ? 'web' : 'browserslist';

const devtool = devMode ? 'source-map' : undefined;

module.exports = {
    mode,
    target,
    devtool,
    devServer: {
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true
    },
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: 'index.[contenthash].js',
        assetModuleFilename: 'assets/[name][ext]'
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new CopyPlugin({
          patterns: [
            {
              from: '**/*',
              context: path.resolve(__dirname, 'src', 'assets'),
              to: './assets',
              noErrorOnMissing: true,
            },
          ],
        }),
    ],
    module: {
        rules: [
          {
            test: /\.html$/i,
            loader: "html-loader",
          },
          { 
            test: /.ts$/i, 
            use: 'ts-loader',
          },
          {
            test: /\.(svg|png|jpg)$/i, 
            type: 'asset/resource'
          },
          {
            test: /\.(c|sa|sc)ss$/i,
            use: [devMode ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
          },
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ],
      }
}