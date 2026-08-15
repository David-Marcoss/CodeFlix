import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(AuthGuard)
  @Get()
  authValidation() {
    return {
      isValid: true,
    };
  }
}
