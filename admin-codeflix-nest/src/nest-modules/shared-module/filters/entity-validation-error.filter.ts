import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityValidationError } from '../../../core/shared/domain/validators/validation.error';
import { union } from 'lodash';

// adciona o filtro de error, para formatar a resposta de erro quando um EntityValidationError for lançado

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: union(
        ...exception.error.reduce(
          (acc, error) =>
            acc.concat(
              //@ts-expect-error - error can be string
              typeof error === 'string'
                ? [[error]]
                : [
                    Object.values(error).reduce(
                      (acc, error) => acc.concat(error),
                      [] as string[],
                    ),
                  ],
            ),
          [] as string[],
        ),
      ),
    });
  }
}
