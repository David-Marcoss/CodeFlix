import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { CheckIsAdminGuard } from './check-is-admin.guard';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        privateKey: configService.get('JWT_PRIVATE_KEY'),
        publicKey: configService.get('JWT_PUBLIC_KEY'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: '60s',
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  providers: [AuthGuard, CheckIsAdminGuard],
  controllers: [AuthController],
  exports: [AuthGuard, CheckIsAdminGuard],
})
export class AuthModule {}
