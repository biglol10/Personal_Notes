// https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html#3-%EB%A1%9C%EB%8D%94

const path = require("path");
const MyWebpackPlugin = require("./my-webpack-plugin");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
    // main: "./app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
  // loader는 module객체에 rules라는 배열에다가 추가할 수 있음
  module: {
    rules: [
      {
        // // test엔 loader가 처리해야될 파일들의 패턴을 입력 (여기에서는 .js로 끝나는 모든걸)
        // // use엔 사용할 로더를 명시함
        // // 모든 js 코드에 대해서 만들었던 my-webpack-loader가 실행되게끔 하는 설정
        // test: /\.js$/,
        // use: [
        //     path.resolve("./my-webpack-loader.js")
        // ],

        // 뒤에서부터 앞에이니 css-loader가 먼저 그 이후에 style-loader
        test: /\.(scss|css)$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader // 프로덕션 환경
            : "style-loader", // 개발 환경
          "css-loader",
          "sass-loader", // Sass를 Css로 컴파일
        ],
      },
      {
        // webpack 5에서는 file-loader대신 위에 껄로 다 가능한듯
        // 작은 이미지 파일은 base64로 인코딩 하는게 좋음
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          // publicPath는 파일로더가 처리하는 파일을 모듈로 사용했을 때 그 경로앞에 추가되는 문자열.. hash는 웹팩이 빌드할 때마다 생기는 hash
          // publicPath: "./dist/",
          name: "[name].[ext]?[hash]",
          limit: 20000, // 20kb 미만인 것들은 base64로
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // new MyWebpackPlugin()
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
        Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
    new webpack.DefinePlugin({
      TWO: "1+1",
      TWOSTRINGIFY: JSON.stringify("1+1"),
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "", // $env:NODE_ENV="development", npm run build
      },
      minify:
        process.env.NODE_ENV === "development"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    new CleanWebpackPlugin(), // dist folder 한번 삭제 하고 빌드
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : []),
  ],
};
