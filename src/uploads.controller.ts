import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';

const MAX_FILE_SIZE = 300 * 1024 * 1024;

@Controller('upload')
export class UploadsController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: "./temp",
        filename: (_, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileId') fileId: string,
    @Body('fileName') fileName: string,
  ) {
    if (!file || !fileId) {
      console.log("file and fileId are required");
      
      throw new BadRequestException('file and fileId are required');
    }
    console.log("came to upload");
    
    return this.appService.uploadObject({
      fileId,
      fileName: fileName || file.originalname,
      mimeType: file.mimetype,
      filePath: file.path,
    });
  }
}
