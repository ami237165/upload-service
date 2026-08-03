import { PreSignRequestParams } from "node_modules/minio/dist/esm/internal/type.mjs";

export interface GetPresignedUrlDTO {  
  objectName: string;
  expires?: number;
  respHeaders?: PreSignRequestParams | Date;
  requestDate?: Date;
}
