// Plugin은 클래스로 선언
// 모듈로 연결된 파일들을 하나로 처리해주는데 plugin이 개입해서 output 번들링의 후처리를 담당
class MyWebpackPlugin {
  apply(compiler) {
    //   // 이건 plugin이 종료되었을 때 실행
    // compiler.hooks.done.tap("My Plugin", (stats) => {
    //   console.log("MyWebpackPlugin: done");
    // });

    // compiler.plugin() 함수로 후처리한다
    // 웹팩 내장 플러그인 BannerPlugin 코드 (이게 BannerPlugin은 아니고 custom으로 직접 만든 것)
    compiler.plugin("emit", (compilation, callback) => {
      // compilation이라는 부분을 통해 웹팩이 번들링한 결과물에 접근 가능... main.js 소스코드를 가져옴
      const source = compilation.assets["main.js"].source();
      compilation.assets["main.js"].source = () => {
        const banner = [
          "/**",
          " * 이것은 BannerPlugin이 처리한 결과입니다.",
          " * Build Date: 2019-10-10",
          " */",
        ].join("\n");
        return banner + "\n" + source; // main.js 상단에 주석처리 부분이 생김
      };
      //   console.log(source);
      callback();
    });
  }
}

module.exports = MyWebpackPlugin;
