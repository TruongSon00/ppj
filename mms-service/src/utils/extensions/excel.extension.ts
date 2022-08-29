import { Row, Cell } from 'exceljs';
import { isEmpty } from 'lodash';

export function getCellValueByRow(
  row: Row,
  indexOrKey: number | string,
): string {
  return getCellValue(row.getCell(indexOrKey));
}

export function getCellValue(cell: Cell): string {
  const cellValueAsString = cell?.value?.toString()?.trim();

  if (isEmpty(cellValueAsString)) return undefined;

  return cellValueAsString;
}
