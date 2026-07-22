import { config as readEnv } from 'dotenv';
import { join } from 'path';

export class Config {
  static env: any = null;

  static db() {
    Config.readEnv();

    return {
      dialect: 'sqlite' as any,
      host: Config.env.DB_HOST,
      logging: Config.env.DB_LOGGING === 'true',
    };
  }

  static cloudnaryUploadPath() {
    Config.readEnv();

    return Config.env.CLOUDNARY_UPLOAD_PATH;
  }

  static cloudnaryCredentials() {
    Config.readEnv();

    return {
      cloudnary_cloud_name: Config.env.CLOUDINARY_CLOUD_NAME,
      cloudnary_api_key: Config.env.CLOUDINARY_API_KEY,
      cloudnary_api_secret: Config.env.CLOUDINARY_API_SECRET,
    };
  }

  static rabbitmqUri() {
    Config.readEnv();

    return Config.env.RABBITMQ_URI;
  }

  static readEnv() {
    if (Config.env) {
      return;
    }

    const { parsed } = readEnv({
      path: join(__dirname, `../../../../envs/.env.${process.env.NODE_ENV}`),
    });

    Config.env = {
      ...parsed,
      ...process.env,
    };
  }
}
