import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Readable } from 'stream';
import fs from 'fs';

export interface UploadObjectPayload {
  fileId: string;
  fileName: string;
  mimeType: string;
  filePath: string;
}

export interface GetObjectInfoPayload {
  objectKey: string;
}

@Injectable()
export class AppService {
  private readonly bucketName = process.env.MINIO_BUCKET_NAME || 'chat-media';

  constructor(private readonly minioClient: Minio.Client) {}

  // private toBuffer(
  //   fileBuffer: Buffer | { type: 'Buffer'; data: number[] },
  // ): Buffer {
  //   if (Buffer.isBuffer(fileBuffer)) return fileBuffer;
  //   return Buffer.from(fileBuffer.data);
  // }

  async uploadObject(payload: UploadObjectPayload) {
    const stream = fs.createReadStream(payload.filePath);
    const stat = await fs.promises.stat(payload.filePath);
    const objectKey = payload.fileId;

    try {
      await this.minioClient.putObject(
        this.bucketName,
        objectKey,
        stream,
        stat.size,
        {
          'Content-Type': payload.mimeType,
          'X-Original-Name': payload.fileName,
        },
      );

      return {
        success: true,
        objectKey,
        fileId: payload.fileId,
        fileName: payload.fileName,
        mimeType: payload.mimeType,
        size: stat.size,
      };
    } catch (error) {
      console.log('eeeeeeeeee :', error);

      return { success: false, error: String(error) };
    } finally {
      await fs.promises.unlink(payload.filePath);
    }
  }

  async getObjectInfo(payload: GetObjectInfoPayload) {
    try {
      const stat = await this.minioClient.statObject(
        this.bucketName,
        payload.objectKey,
      );

      return {
        success: true,
        objectKey: payload.objectKey,
        size: stat.size,
        mimeType:
          stat.metaData?.['content-type'] ||
          stat.metaData?.['Content-Type'] ||
          'application/octet-stream',
        fileName:
          stat.metaData?.['x-original-name'] ||
          stat.metaData?.['X-Original-Name'] ||
          payload.objectKey,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async getObjectStream(payload: GetObjectInfoPayload): Promise<Readable> {
    return this.minioClient.getObject(this.bucketName, payload.objectKey);
  }
}
