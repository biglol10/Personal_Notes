const data = [
  {
    id: 1,
    name: "[키친르쎌] 홈메이드 칠리소스 포크립 650g",
    image:
      "https://dcx-tech.s3.ap-northeast-2.amazonaws.com/profile_img/f262da12f2dbdb2b25b8.png",
  },
  {
    id: 2,
    name: "[키친르쎌] 이탈리아 파티 세트 3~4인분",
    image:
      "https://dcx-tech.s3.ap-northeast-2.amazonaws.com/profile_img/588f72bbe7c1d2a39af5.png",
  },
];

export default {
  list(query) {
    return new Promise((res) => {
      setTimeout(() => {
        res(data);
      }, 200);
    });
  },
};
