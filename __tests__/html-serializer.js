const toDiffableHtml = require("diffable-html");

module.exports = {
  test: object => typeof object === "string" && object.trim()[0] === "<",
  print: toDiffableHtml
};
