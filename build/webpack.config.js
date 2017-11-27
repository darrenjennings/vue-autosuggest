const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

module.exports = merge(require("./webpack.base"), {
  context: __dirname,

  entry: {
    index: "../src/index.js",
    "index.min": "../src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    library: "VueAutosuggest",
    libraryTarget: "umd"
  },

  externals: ["vue"],

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
});
