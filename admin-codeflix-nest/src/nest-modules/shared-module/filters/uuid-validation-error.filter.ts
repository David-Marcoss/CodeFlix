import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UuidValidationError } from '../../../core/shared/domain/value-objects/uuid.vo';

// adciona o filtro de error, para formatar a resposta de erro quando um UuidValidationError for lançado

@Catch(UuidValidationError)
export class UuidValidationErrorFilter implements ExceptionFilter {
  catch(exception: UuidValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'Validation failed (uuid is expected)',
    });
  }
}
