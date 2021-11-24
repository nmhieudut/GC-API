export function convertToVND(currency, number) {
  switch (currency) {
    case 'USD':
      return number * 23000;
    default:
      return number;
  }
}
