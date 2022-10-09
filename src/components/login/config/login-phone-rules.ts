export const rules = {
  phone: [
    {
      required: true,
      message: "手机号不能为空！",
      trigger: "blur",
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号无效！",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "验证码不能为空！",
      trigger: "blur",
    },
    {
      pattern: /^\d{6}$/,
      message: "验证码长度为6！",
      trigger: "blur",
    },
  ],
};
