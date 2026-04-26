import { HttpStatus } from '@nestjs/common';

export const ERROR_CODES = {
  USER_PHONE_EXISTS: {
    code: 'USER_PHONE_EXISTS',
    status: HttpStatus.BAD_REQUEST,
    defaultMessage: 'Số điện thoại đã tồn tại',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
    defaultMessage: 'Người dùng không tồn tại',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    status: HttpStatus.UNAUTHORIZED,
    defaultMessage: 'Thông tin đăng nhập không hợp lệ',
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    defaultMessage: 'Lỗi hệ thống',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    status: HttpStatus.UNAUTHORIZED,
    defaultMessage: 'Bạn chưa đăng nhập hoặc token không hợp lệ',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    status: HttpStatus.FORBIDDEN,
    defaultMessage: 'Bạn không có quyền truy cập tài nguyên này',
  }
} as const;