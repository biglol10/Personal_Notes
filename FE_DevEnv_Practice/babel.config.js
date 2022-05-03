module.exports = {
  //   1번
  //   plugins: [
  //     "@babel/plugin-transform-block-scoping",
  //     "@babel/plugin-transform-arrow-functions",
  //     "@babel/plugin-transform-strict-mode",
  //   ],
  //   2번
  //   presets: ["./my-babel-preset.js"],
  //   3번
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79",
          ie: "11",
        },
        useBuiltIns: "usage", // 'entry' 도 가능
        corejs: {
          version: 2, // 3도 가능
        },
      },
    ],
  ],
};

// 이후 npx babel app.js 만 해도 됨
