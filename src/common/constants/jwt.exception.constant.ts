import { ExceptionDTO } from '../dto/exception.dto';
import { HttpStatus } from '@nestjs/common';

type JWT_EXCEPTION_KEY = 'TOKEN_UNAUTHORIZED' | 'NO_TOKEN';

export const JWT_EXCEPTION: Record<JWT_EXCEPTION_KEY, ExceptionDTO> = {
  TOKEN_UNAUTHORIZED: {
    errorCode: '10000001',
    message: '驗證錯誤',
    status: HttpStatus.UNAUTHORIZED,
  },
  NO_TOKEN: {
    errorCode: '10000002',
    message: '驗證錯誤',
    status: HttpStatus.UNAUTHORIZED,
  },
};
