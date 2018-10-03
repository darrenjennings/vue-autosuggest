module.exports = {
  env: {
    browser: true
  },
  extends: ["plugin:vue/recommended"],
  plugins: ["vue"],
  rules: {
    "vue/valid-v-if": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }]
  }
};
