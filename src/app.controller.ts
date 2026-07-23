import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get-object-info' })
  async getObjectInfo(@Payload() payload: { objectKey: string }) {
    return this.appService.getObjectInfo(payload);
  }
  @MessagePattern({ cmd: 'upload-object' })
  async uploadObject(@Payload() payload:any) {
    return this.appService.uploadObject(payload);
  }
}
