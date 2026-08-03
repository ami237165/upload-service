import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadsController } from './uploads.controller';
import * as Minio from 'minio';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, UploadsController],
  providers: [
    AppService,
    {
      provide: Minio.Client,
      useFactory: () => {
        return new Minio.Client({
          endPoint: process.env.MINIO_ENDPOINT || 'localhost',
          port: Number(process.env.MINIO_PORT || 9000),
          useSSL: true,
          accessKey: process.env.MINIO_ACCESS_KEY || '',
          secretKey: process.env.MINIO_SECRET_KEY || '',
        });
      },
    },
  ],
})
export class AppModule {}
