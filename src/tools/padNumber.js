export const padNumber = (number, digits = 2) => {
  const length = (number + "").length;
  if (length < digits) {
    return "0".repeat(digits - length) + (number + "");
  }
  return number + "";
};
