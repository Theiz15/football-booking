import { HttpException } from '@nestjs/common';

type ErrorCodeType = {
  code: string;
  status: number;
  defaultMessage: string;
};

export class BusinessException extends HttpException {
  constructor(error: ErrorCodeType, message?: string) {
    super(
      {
        errorCode: error.code,
        message: message ?? error.defaultMessage,
      },
      error.status,
    );
  }
}