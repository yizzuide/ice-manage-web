export function formatFen2Yuan(amount: number, shouldIgnore?: boolean): string {
  if (amount === 0 || (amount as unknown as string) === "null") {
    return "0";
  }
  if (!amount) {
    return "";
  }
  if (shouldIgnore) {
    return `${amount}`;
  }
  return `${amount / 100}`;
}

export function formatYuan2Fen(salary: number): number {
  let firstNum: string;
  let lastNum: string;
  let res: number;

  if (salary.toString().includes(".")) {
    const salaryArr = salary.toString().split(".");
    firstNum = salaryArr[0];
    lastNum = salaryArr[1].substring(0, 2);
    // 解决 0.9999999999 问题
    res = parseFloat([firstNum, lastNum].join(".")) * 1000 * 100 * 1000 / 1000000;
  } else {
    res = salary * 100;
  }
  return res;
}
