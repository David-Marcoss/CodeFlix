import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/sequelize';

import { DatabaseModule, getSequelizeOptions } from '../database.module';
import { Sequelize } from 'sequelize-typescript';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '@nestjs/config';
import { CONFIG_DB_SCHEMA_TYPES } from '../../config/config.module';

const CONFIG_ENV_KEYS = [
  'DB_VENDOR',
  'DB_HOST',
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_PORT',
  'DB_LOGGING',
  'DB_AUTO_LOAD_MODELS',
];

describe('DatabaseModule Unit Tests', () => {
  afterEach(() => {
    CONFIG_ENV_KEYS.forEach((key) => {
      delete process.env[key];
    });
  });

  describe('sqlite connection', () => {
    const connOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: 'false',
      DB_AUTO_LOAD_MODELS: 'true',
    };

    it('should be a sqlite connection', async () => {
      Object.assign(process.env, connOptions);

      const module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            ignoreEnvFile: true,
          }),
          DatabaseModule,
        ],
      }).compile();

      const conn = module.get<Sequelize>(getConnectionToken());
      expect(conn).toBeDefined();
      expect(conn.options.dialect).toBe('sqlite');
      expect(conn.options.host).toBe(':memory:');
      await module.close();
    });
  });

  describe('mysql connection', () => {
    const connOptions = {
      DB_VENDOR: 'mysql',
      DB_HOST: 'db',
      DB_DATABASE: 'micro_videos',
      DB_USERNAME: 'root',
      DB_PASSWORD: 'root',
      DB_PORT: '3306',
      DB_LOGGING: 'false',
      DB_AUTO_LOAD_MODELS: 'true',
    };

    it('should be a mysql connection', () => {
      const configService = {
        get: (key: keyof typeof connOptions) => {
          const value = connOptions[key];

          return key === 'DB_PORT' ? Number(value) : value;
        },
      } as ConfigService<CONFIG_DB_SCHEMA_TYPES>;

      const conn = getSequelizeOptions(configService);

      expect(conn).toBeDefined();
      expect(conn.dialect).toBe(connOptions.DB_VENDOR);
      expect(conn.host).toBe(connOptions.DB_HOST);
      expect(conn.database).toBe(connOptions.DB_DATABASE);
      expect(conn.username).toBe(connOptions.DB_USERNAME);
      expect(conn.password).toBe(connOptions.DB_PASSWORD);
      expect(conn.port).toBe(Number(connOptions.DB_PORT));
    });
  });
});
