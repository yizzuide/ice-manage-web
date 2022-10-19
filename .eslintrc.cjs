module.exports = {
  // 作用于当前目录
  root: true,
  // vue作为主要解析器
  parser: "vue-eslint-parser",
  env: {
    browser: true,
    node: true,
    // 支持CommonJs解析的文件.cjs
    commonjs: true,
    es2021: true,
  },
  // 继承的配置
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:vue/vue3-essential",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // typescript作为次要解析器
    parser: "@typescript-eslint/parser",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    // 正式环境下不能有调试信息
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-multi-spaces": "off",
    "no-trailing-spaces": "off",
    camelcase: "off",
    quotes: ["warn", "double"], // 使用双引号
    semi: ["error", "always"], // 结尾使用分号
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
};
