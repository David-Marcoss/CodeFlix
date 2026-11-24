import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
  InvalidMediaFileMimeTypeError,
  InvalidMediaFileSizeError,
} from '../../../core/shared/domain/validators/media-file-validator';

@Catch(InvalidMediaFileSizeError, InvalidMediaFileMimeTypeError)
export class MediaFileValidationErrorFilter implements ExceptionFilter {
  catch(exception: InvalidMediaFileSizeError | InvalidMediaFileMimeTypeError, host: ArgumentsHost) {
    host.switchToHttp().getResponse().status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: exception.message,
    });
  }
}
