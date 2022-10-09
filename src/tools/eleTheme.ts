export enum EleTheme {
  LIGHT = "#ffffff",
  DARK = "#000000",
}

export function changeTheme(color: string, theme: EleTheme = EleTheme.LIGHT) {
  // document.documentElement 是全局变量时
  const el = document.documentElement;
  // const el = document.getElementById('xxx')
  const body = document.querySelector("body");

  // 获取 css 变量
  //getComputedStyle(el).getPropertyValue("--el-color-primary");

  // 设置 css 变量
  const mixColor = theme;
  body?.style.setProperty("--van-primary-color", color);
  el.style.setProperty("--el-color-primary", colourBlend(color, mixColor, 0));
  for (let i = 1; i < 10; i++) {
    el.style.setProperty(
      `--el-color-primary-light-${i}`,
      colourBlend(color, mixColor, i / 10)
    );
    el.style.setProperty(
      `--el-color-primary-dark-${i}`,
      colourBlend(color, mixColor, i / 10)
    );
  }
  el.style.setProperty(
    "--el-color-primary-dark-2",
    colourBlend(color, mixColor, 0.2)
  );
}

function colourBlend(c1: string, c2: string, ratio: number) {
  ratio = Math.max(Math.min(Number(ratio), 1), 0);
  const r1 = parseInt(c1.substring(1, 3), 16);
  const g1 = parseInt(c1.substring(3, 5), 16);
  const b1 = parseInt(c1.substring(5, 7), 16);
  const r2 = parseInt(c2.substring(1, 3), 16);
  const g2 = parseInt(c2.substring(3, 5), 16);
  const b2 = parseInt(c2.substring(5, 7), 16);
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  const rStr = ("0" + (r || 0).toString(16)).slice(-2);
  const gStr = ("0" + (g || 0).toString(16)).slice(-2);
  const bStr = ("0" + (b || 0).toString(16)).slice(-2);
  return "#" + rStr + gStr + bStr;
}
