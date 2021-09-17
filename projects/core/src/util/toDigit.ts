/**
 * Pads a number to make it two digits.
 * @param n The number to pad.
 * @returns The padded number.
 */
const toDigit = (n: number) => {
  return `00${n}`.slice(-2);
};

export default toDigit;
