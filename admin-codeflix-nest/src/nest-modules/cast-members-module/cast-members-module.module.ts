import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CastMembersController } from './cast-members-module.controller';
import { CAST_MEMBER_PROVIDERS } from './cast-members.provider';
import { CastMemberModel } from '../../core/cast-member/infra/db/sequelize/cast-member.model';

@Module({
  controllers: [CastMembersController],
  imports: [SequelizeModule.forFeature([CastMemberModel])],
  providers: [
    ...Object.values(CAST_MEMBER_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBER_PROVIDERS.USE_CASES),
  ],
  exports: [CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY],
})
export class CastMembersModule {}
