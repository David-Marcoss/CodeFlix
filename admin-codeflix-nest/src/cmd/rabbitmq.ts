import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

// inicia os consumidores do rabbitmq, de forma separada da api http,
// para que seja possivel iniciar os consumidores em um container separado,
// e assim escalar os consumidores de forma independente da api http
// util no ambiente de prod
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  await app.init();
}
bootstrap();
