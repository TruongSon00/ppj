export function generateCode(
  latestObj: any,
  defaultCode: string,
  maxLength: number,
  padChar: string,
  gap = 1,
): string {
  let generatedCode;

  if (latestObj)
    generatedCode = (Number.parseInt(latestObj.code) + gap).toString();
  else generatedCode = defaultCode;

  return generatedCode.padStart(maxLength, padChar);
}

export function generateCodeByPreviousCode(
  currentCode: number,
  maxLength: number,
  gap: number,
  padChar: string,
): string {
  return (currentCode + gap).toString().padStart(maxLength, padChar);
}

export function generateCodeByNumber(
  number: any,
  defaultCode: string,
  maxLength: number,
  padChar: string,
): string {
  const generatedCode = (+number + 1).toString();
  return generatedCode.padStart(maxLength, padChar);
}
