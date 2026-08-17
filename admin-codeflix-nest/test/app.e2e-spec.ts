import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Reflector } from '@nestjs/core';
import { WrapperDataInterceptor } from '../src/nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { NotFoundErrorFilter } from '../src/nest-modules/shared-module/filters/not-found-error.filter';
import { EntityValidationErrorFilter } from '../src/nest-modules/shared-module/filters/entity-validation-error.filter';

describe('AppModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(
      new WrapperDataInterceptor(),
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalFilters(
      new NotFoundErrorFilter(),
      new EntityValidationErrorFilter(),
    );
    await app.init();
  });

  it('/categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .authenticate(app)
      .expect(200);
  });

  it('/categories (GET) rejects requests without a token', () => {
    return request(app.getHttpServer()).get('/categories').expect(401);
  });

  it('/categories (GET) rejects authenticated users without the admin role', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .authenticate(app, false)
      .expect(403);
  });

  it('/videos/:id (GET) resolves the request-scoped video dependencies', () => {
    return request(app.getHttpServer())
      .get('/videos/4e9e2e4e-4b4a-4b4a-8b8b-8b8b8b8b8b8b')
      .authenticate(app)
      .expect(200);
  });

  afterEach(async () => {
    await app?.close();
  });
});
