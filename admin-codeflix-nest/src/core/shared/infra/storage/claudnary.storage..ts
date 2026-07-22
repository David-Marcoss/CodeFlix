import { v2 as Cloudinary, type DeleteApiResponse } from 'cloudinary';
import { IStorage } from '../../application/storage.interface';
import { Config } from '../config';

export class CloudnaryStorage implements IStorage {
  constructor(private readonly cloudinary: typeof Cloudinary) {}

  private getPublicId(id: string): string {
    return `${Config.cloudnaryUploadPath()}/${id}`;
  }

  private getResourceType(mimeType?: string): 'image' | 'video' | 'raw' {
    if (mimeType?.startsWith('image/')) {
      return 'image';
    }

    if (mimeType?.startsWith('video/')) {
      return 'video';
    }

    return 'raw';
  }

  async get(
    id: string,
  ): Promise<{ data: Buffer; name: string; mime_type?: string }> {
    const publicId = this.getPublicId(id);

    const result = await this.cloudinary.api.resource(publicId, {
      resource_type: 'raw',
      type: 'upload',
    });

    const response = await fetch(result.secure_url);

    if (!response.ok) {
      throw new Error(`Não foi possível baixar o arquivo: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    return {
      data: Buffer.from(arrayBuffer),
      name: id,
    };
  }

  async store(object: {
    id: string;
    data: Buffer;
    mime_type?: string;
  }): Promise<void> {
    const resourceType = this.getResourceType(object.mime_type);

    await new Promise<void>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          public_id: object.id,
          overwrite: true,
          resource_type: resourceType,
          type: 'upload',
        },
        (error, result) => {
          if (error) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(error);
            return;
          }

          if (!result) {
            reject(
              new Error('O Cloudinary não retornou o resultado do upload.'),
            );
            return;
          }

          resolve();
        },
      );

      uploadStream.end(object.data);
    });
  }

  deleteFile(id: string, mimeType?: string): Promise<DeleteApiResponse> {
    return this.cloudinary.uploader.destroy(this.getPublicId(id), {
      resource_type: this.getResourceType(mimeType),
      type: 'upload',
      invalidate: true,
    });
  }
}
