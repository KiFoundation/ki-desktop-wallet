/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: ["@vue/eslint-config-typescript", "@vue/eslint-config-prettier"],
  parserOptions: {
    ecmaVersion: 2020,
  },
};
