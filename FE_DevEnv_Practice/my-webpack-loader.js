// loader는 함수 형태로 작성
// loader가 그 파일을 읽고 읽은 파일의 내용이 content로 들어옴
module.exports = function myWebpackLoader(content) {
  //   console.log("myWebpackLoader가 동작함");

  // app.js 에 있는 console.log를 alert로 변경
  return content.replace("console.log(", "alert(");
};
