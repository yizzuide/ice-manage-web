export function formatFen2Yuan(amount: number, shouldIgnore?: boolean): string {
  if(amount === 0 || (amount as unknown as string) === "null") {
    return "0";
  }
  if(!amount) {
    return "";
  }
  if(shouldIgnore) {
    return `${amount}`;
  }
  return `${amount / 100}`;
}