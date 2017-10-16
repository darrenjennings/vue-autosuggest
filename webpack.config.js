const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.js/,
        loaders: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loaders: ["vue-loader"],
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: [".js", ".vue"]
  },

  entry: {
    index: "./src/index.js",
    "index.min": "./src/index.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "vue-autosuggest",
    libraryTarget: "umd"
  },

  externals: ["vue"],

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ]
};
