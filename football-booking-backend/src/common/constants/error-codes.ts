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
  },
  FILE_REQUIRED: {
    code: 'FILE_REQUIRED',
    status: HttpStatus.BAD_REQUEST,
    defaultMessage: 'File is required',
  },
  INVALID_FILE_TYPE: {
    code: 'INVALID_FILE_TYPE',
    status: HttpStatus.BAD_REQUEST,
    defaultMessage: 'Chỉ chấp nhận định dạng ảnh JPEG, PNG, WEBP',
  },
  FILE_TOO_LARGE: {
    code: 'FILE_TOO_LARGE',
    status: HttpStatus.BAD_REQUEST,
    defaultMessage: 'Dung lượng ảnh không được vượt quá 5MB',
  }, 
  COURT_CREATION_FAILED: {
    code: 'COURT_CREATION_FAILED',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    defaultMessage: 'Lỗi khi tạo sân',
  },
  COURT_NOT_FOUND: {
    code: 'COURT_NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
    defaultMessage: 'Không tìm thấy sân',
  },
  DUPLICATE_START_TIMES: {
    code: 'DUPLICATE_START_TIMES',
    status: HttpStatus.BAD_REQUEST,
    defaultMessage: 'Các startTime trong cùng một ngày không được trùng nhau',
  },
  TIME_SLOT_NOT_FOUND: {
    code: 'TIME_SLOT_NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
    defaultMessage: 'Không tìm thấy khung giờ',
  },
  TIME_SLOTS_OVERLAP: {
    code: 'TIME_SLOTS_OVERLAP',
    status: HttpStatus.BAD_REQUEST,
    defaultMessage: 'Các khung giờ bị chồng lấn (overlap)',
  },
  INVALID_TIME_RANGE: {
    code: 'INVALID_TIME_RANGE',
    status: HttpStatus.BAD_REQUEST,
    defaultMessage: 'Khoảng thời gian không hợp lệ',
  },
  

} as const;