export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const joinToCompare = (
  callback: (any) => any,
  arr: string[],
  separator: string,
): string => {
  return arr.map(callback).join(separator).toLowerCase();
};
