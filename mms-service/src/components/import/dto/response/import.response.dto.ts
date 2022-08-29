export class ImportResponseDto<T> {
  results: T[];
  isSuccess: boolean;
  success: number;
  fail: number;
  total: number;

  constructor(total: number) {
    this.results = new Array<T>();
    this.isSuccess = true;
    this.success = 0;
    this.fail = 0;
    this.total = total;
  }
}
