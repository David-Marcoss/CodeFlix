import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { NotFoundError } from '../../../core/shared/domain/errors/notFoundError';

// adciona o filtro de error, para formatar a resposta de erro quando um NotFoundError for lançado

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message,
    });
  }
}
