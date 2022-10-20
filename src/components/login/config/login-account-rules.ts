// 验证规则, element-plus使用的async-validator： https://github.com/yiminghe/async-validator
export const rules = {
  // prop="username"
  username: [
    {
      required: true,
      message: "用户名不能为空！",
      trigger: "blur",
    },
    {
      pattern: /^[a-z0-9]{5,18}$/,
      message: "用户名长度在5到18之间！",
      trigger: "blur",
    },
  ],
  // prop="password"
  password: [
    {
      required: true,
      message: "密码不能为空！",
      trigger: "blur",
    },
    {
      pattern: /^[a-z0-9]{6,}$/,
      message: "密码长度在6个以上！",
      trigger: "blur",
    },
  ],
  // prop="code"
  code: [
    {
      required: true,
      message: "验证码不能为空！",
      trigger: "blur",
    },
    {
      pattern: /^[a-z0-9]{4}$/,
      message: "验证码长度为4！",
      trigger: "blur",
    },
  ],
};
