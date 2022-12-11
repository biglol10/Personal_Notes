module.exports = {
  //   content: ["./build/index.html", "./build/static/js/*.js"],
  //   css: ["./build/static/css/*.css"],
  defaultExtractor: (content) => content.match(/[\w\:\-]+/g) || [], // \w = [0-9a-zA-Z_]
};
