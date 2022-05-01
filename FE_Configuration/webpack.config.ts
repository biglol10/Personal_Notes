import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'; // ts에서만 쓰는건데
// ts 검사를 할 때 blocking 식으로 검사하는데 (blocking 다음 동작을 막는거) 그런데 fork를 하게되면 동시에 돌아가게 됨
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}
const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'sleact', // 웹팩 설정의 이름
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'inline-source-map', // inline-source-map 또는 eval
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // 바벨이 처리할 확장자 목록
    alias: {
      // ../../ 없애는 거. tsconfig.json에서 하고 여기에서도 해줘야함. 소스코드는 ts로 치지만 tsconfig.json이 검사하지만, 실제로 js로 바꿔주는건 webpack임. 얘를 보고 바꿈
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client', // entry point
  },
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader', // ts나 tsx를 babel-loader가 js로 바꿔주는데
        options: {
          // 바꿔줄 때 babel에 대한 설정
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] }, // target에다가 적어준 브라우저를 지원하게끔 알아서 env preset이 바꿔줌 //  browsers: ['IE 10']
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react', // react 코드 바꿔주는 애
            '@babel/preset-typescript', // typescript 코드 바꿔주는 애, 이걸 다 해야 IE까지 돌아갈 수 있게끔 만들 수 있음
          ],
          env: {
            development: {
              plugins: [['@emotion/babel-plugin', { sourceMap: true }], require.resolve('react-refresh/babel')],
            },
            production: {
              plugins: ['@emotion/babel-plugin'],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'], // 얘내들이 css를 js로 번들링하고 image파일은 file-loader나 url-loader가 번들링 해줌
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      // ts 할 사람들만
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }), // 공통적인거... react에서 NODE_ENV라는 변수를 사용할 수 있게끔 만들어줌... FE에서도 접근 가능하게끔
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js', // name에다가 대괄호를 붙여넣으면 name은 entry의 app으로 됨... entry app, app2, app3이렇게 만들기 가능
    publicPath: '/dist/',
  },
  devServer: {
    devMiddleware: { publicPath: '/dist' },
    static: { directory: path.resolve(__dirname) },
    hot: true,
    port: 3090,
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(
    new ReactRefreshWebpackPlugin({
      overlay: {
        useURLPolyfill: true,
      },
    }),
  );
  //   config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: false }));
}
if (!isDevelopment && config.plugins) {
  //   config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  //   config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
