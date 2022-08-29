import { Expose, Type } from 'class-transformer';

export class RangeDate {
  @Expose()
  type: number;

  @Expose()
  tag: string;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;

  constructor(type: number, tag: string, startDate: string, endDate: string) {
    this.type = type;
    this.tag = tag;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class CountReport {
  @Expose()
  count: number;

  @Expose()
  status: number;
}

export class ReportStockByDay {
  @Expose()
  reportType: number;

  @Expose()
  tag: string;

  @Expose()
  rangeDate: string;

  @Expose()
  @Type(() => CountReport)
  countReport: CountReport[];

  constructor(
    reportType: number,
    tag: string,
    countReport: CountReport[],
    rangeDate: string,
  ) {
    this.reportType = reportType;
    this.tag = tag;
    this.countReport = countReport;
    this.rangeDate = rangeDate;
  }
}
