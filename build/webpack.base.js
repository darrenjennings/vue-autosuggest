const eslintFriendlyFormatter = require("eslint-friendly-formatter");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        test: /\.(js|vue)$/,
        loader: "eslint-loader",
        enforce: "pre",
        options: {
          formatter: eslintFriendlyFormatter
        }
      },
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
  }
};
