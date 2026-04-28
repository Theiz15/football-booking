import { PipeTransform, Injectable } from '@nestjs/common';
import { BusinessException } from '../exceptions/business.exception';
import { ERROR_CODES } from '../constants/error-codes';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private isOptional: boolean = false, private maxSize?: number) { }

  transform(file?: Express.Multer.File) {
    if (!file) {
      if (this.isOptional) return undefined;
      throw new BusinessException(ERROR_CODES.FILE_REQUIRED, 'File is required');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BusinessException(ERROR_CODES.INVALID_FILE_TYPE, 'Chỉ chấp nhận định dạng ảnh JPEG, PNG, WEBP');
    }

    const maxSize = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BusinessException(ERROR_CODES.FILE_TOO_LARGE, 'Dung lượng ảnh không được vượt quá 5MB');
    }

    return file;
  }
}