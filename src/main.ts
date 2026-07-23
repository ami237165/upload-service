import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4002,
    },
  });

  await app.startAllMicroservices();

  const httpPort = Number(process.env.HTTP_PORT || 4003);
  await app.listen(httpPort);
  console.log(`📥 Upload TCP microservice on port 4002`);
  console.log(`📥 Upload HTTP service on port ${httpPort}`);
}
bootstrap();
