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
  async uploadObject(@Payload() payload: any) {
    return this.appService.uploadObject(payload);
  }

  @MessagePattern({ cmd: 'get-presigned-url' })
  async getPresignedUrl(@Payload() paylaod: any) {
    return await this.appService.getPresignedUrl(paylaod);
  }
  @MessagePattern({ cmd: 'get-presigned-put-url' })
  async getPresignedPutUrl(@Payload() paylaod: any) {
    console.log("in get-presigned-put-url");
    
    return await this.appService.presignedPutObject(paylaod);
  }
}
