// import * as math from "./math.js";

// console.log(math.sum(1, 2));

// 이렇게 쓰려면 css 파일이 모듈이 되어야 함... css loader가 해줌
// import "./app.css";
import "./app.scss";

import nyancat from "./nyancat.jpg";

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
        <img src="${nyancat}" />
    `;
});

// .env 파일의 NODE_ENV를 말하는 것이 아닌 webpack의 mode를 나타냄
console.log(process.env.NODE_ENV);
console.log(TWO);
console.log(TWOSTRINGIFY);
console.log(api.domain);
