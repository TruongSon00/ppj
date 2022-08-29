import Big from 'big.js';

export const minus = (first: number, second: number): number => {
  return Number(new Big(first).minus(new Big(second)));
};

export const plus = (first: number, second: number): number => {
  return Number(new Big(first).plus(new Big(second)));
};

export const mul = (first: number, second: number): number => {
  return Number(new Big(first).mul(new Big(second)));
};

export const div = (first: number, second: number): number => {
  return Number(new Big(first).div(new Big(second)));
};

export const getDaysArray = function (start, end) {
  const arr = [];
  for (
    let dt = new Date(start);
    dt.setHours(0, 0, 0, 0) <= new Date(end).setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

export const getDaysBetweenDates = (start, end) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate: any = new Date(start);
  const secondDate: any = new Date(end);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
};

export const truncateNumber = (number, index = 2) => {
  // cutting the number
  return +number
    .toString()
    .slice(0, number.toString().indexOf('.') + (index + 1));
};
