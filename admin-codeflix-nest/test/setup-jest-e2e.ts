import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

process.env.NODE_ENV = 'e2e';

Object.assign(request.Test.prototype, {
  authenticate(this: request.Test, app: INestApplication, forceAdmin = true) {
    const jwtService = app.get(JwtService);
    const token = jwtService.sign({
      realm_access: {
        roles: forceAdmin ? ['admin-catalog'] : [],
      },
    });

    return this.set('Authorization', `Bearer ${token}`);
  },
});
