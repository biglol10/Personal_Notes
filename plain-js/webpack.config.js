const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      minify: {
        removeRedundantAttributes: false, // do not remove type="text"
      },
    }),
    new MiniCssExtractPlugin({
      filename: "common.css",
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        // 다시 설정한다.
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: ["file-loader"],
      },
    ],
  },
  devServer: {
    // 개발 서버가 dist 폴더를 제공할 수 있도록 설정
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 8080,
  },
};
