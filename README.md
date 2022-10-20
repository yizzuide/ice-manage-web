# 环境配置

1. 设置 NODE_ENV 变量
   npm i cross-env -g
   在 package.json 命令里添加：cross-env NODE_ENV=xxx

# ESLint

1. 安装插件 ESLint 和 Prettier ESLint，添加配置：

```json
"editor.defaultFormatter": "rvest.vs-code-prettier-eslint",
"editor.formatOnPaste": false, // required
"editor.formatOnType": false, // required
"editor.formatOnSave": true, // optional
"editor.formatOnSaveMode": "file", // required to format on save
"files.autoSave": "onFocusChange" // optional but recommended
```

2. 执行创建配置： eslint --init
3. 安装开发插件 npm i -D vue-eslint-parser prettier eslint @typescript-eslint/parser typescript
4. 添加 git hook，并修改 pre-commit 的运行命令为：npm run lint-fix npx husky-init && npm install
5. 安装提交模板命令 npm i commitizen -D // 初始化 npx commitizen init cz-conventional-changelog --D --save-exact // 提交命令 npx cz
6. 提交验证 npm i @commitlint/config-conventional @commitlint/cli -D // 配置文件(cjs：CommonJS)
   commit.config.cjs // 创建 git hook npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"

# 其它插件

1. 安装 vite-svg-loader
   // https://www.npmjs.com/package/vite-svg-loader
   npm i vite-svg-loader -D
2. 安装 qs
   npm i qs --save
   npm i @types/qs -D

# Element Plus

1. 在非 vue 文件中使用时自动导入样式 npm i vite-plugin-style-import consola -D
2. 安装样式扩展： sass npm i sass -D
3. 安装初始化样式 npm i normalize.css --save

# 服务地址

1. host url
   http://152.136.185.210:5000/
2. 接口文档
   https://documenter.getpostman.com/view/12387168/TzsfmQvw
