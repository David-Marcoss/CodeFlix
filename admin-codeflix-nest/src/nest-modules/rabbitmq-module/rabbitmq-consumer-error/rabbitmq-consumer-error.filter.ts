import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NotFoundError } from '../../../core/shared/domain/errors/notFoundError';
import { EntityValidationError } from '../../../core/shared/domain/validators/validation.error';
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';

import { ConsumeMessage, MessagePropertyHeaders } from 'amqplib';

// filtro de tratamento de erros para o consumo de mensagens do RabbitMQ,
// para que seja possivel tratar erros de forma padronizada e reprocessar mensagens que falharam no processamento
@Catch()
export class RabbitmqConsumeErrorFilter implements ExceptionFilter {
  static RETRY_COUNT_HEADER = 'x-retry-count';
  static MAX_RETRY_COUNT = 3;

  // Erros que não devem ser reprocessados pela fila, ou seja serão descartados da fila
  // Erros de dados inválidos, erros de validação, erros de entidade não encontrada, etc...
  static readonly UNPROCESSABLE_ERRORS = [
    NotFoundError,
    EntityValidationError,
    UnprocessableEntityException,
    BadRequestException,
  ];

  constructor(private amqpConection: AmqpConnection) {}

  async catch(exception: Error, host: ArgumentsHost) {
    // console.error('RabbitmqConsumerErrorFilter', exception);

    if (host.getType<'rmq'>() !== 'rmq') {
      return;
    }

    const isUnprocessableError =
      RabbitmqConsumeErrorFilter.UNPROCESSABLE_ERRORS.some(
        (error) => exception instanceof error,
      );

    if (isUnprocessableError) {
      return new Nack(false);
    }

    const ctx = host.switchToRpc();
    const message: ConsumeMessage = ctx.getContext();

    console.log(
      'RabbitmqConsumerErrorFilter - message',
      Buffer.from(message.content).toString(),
    );
    console.log(
      'RabbitmqConsumerErrorFilter - retry count',
      message.properties.headers?.[
        RabbitmqConsumeErrorFilter.RETRY_COUNT_HEADER
      ],
    );

    if (
      message.properties.headers &&
      this.shouldRetry(message.properties.headers)
    ) {
      await this.retry(message);
      return;
    }

    return new Nack(false);
  }

  private shouldRetry(messageHeader: MessagePropertyHeaders): boolean {
    const retryHeader = RabbitmqConsumeErrorFilter.RETRY_COUNT_HEADER;

    const retryCount = RabbitmqConsumeErrorFilter.MAX_RETRY_COUNT;

    return (
      !(retryHeader in messageHeader) || messageHeader[retryHeader] < retryCount
    );
  }

  // Reprocessa a mensagem com um delay de 5 segundos, incrementando o contador de tentativas
  // A mensagem será reprocessada na fila "direct.delayed" com o mesmo routing key da mensagem original
  private async retry(message: ConsumeMessage) {
    const messageHeader = message.properties.headers || {};
    const retryHeader = RabbitmqConsumeErrorFilter.RETRY_COUNT_HEADER;

    messageHeader[retryHeader] = (messageHeader[retryHeader] || 0) + 1;
    messageHeader['x-delay'] = 5000; // 5 seconds delay

    return this.amqpConection.publish(
      'direct.delayed',
      message.fields.routingKey,
      message.content,
      {
        headers: messageHeader,
        correlationId: message.properties.correlationId,
      },
    );
  }
}
