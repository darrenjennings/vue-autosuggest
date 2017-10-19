const path = require("path");
const merge = require("webpack-merge");

module.exports = merge(require("../build/webpack.base"), {
  context: __dirname,

  entry: "./index.js",

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.js",
    publicPath: "/build/"
  },

  resolve: {
    alias: {
      vue: "vue/dist/vue.js"
    }
  },

  devServer: {
    contentBase: __dirname,
    port: 2000
  }
});
