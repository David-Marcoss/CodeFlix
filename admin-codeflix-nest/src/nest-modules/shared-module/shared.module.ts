import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudnaryStorage } from '../../core/shared/infra/storage/claudnary.storage.';

@Global()
@Module({
  providers: [
    {
      provide: 'IStorage',
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
        });

        return new CloudnaryStorage(cloudinary);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['IStorage'],
})
export class SharedModule {}
