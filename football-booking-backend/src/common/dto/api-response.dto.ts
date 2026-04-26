export class ApiResponseDto<T> {
  statusCode: number = 1000;
  message!: string;
  data?: T;

  constructor(message: string, data?: T, statusCode?: number) {
    this.message = message;
    this.data = data;
    if (statusCode) {
      this.statusCode = statusCode;
    }
  }
}