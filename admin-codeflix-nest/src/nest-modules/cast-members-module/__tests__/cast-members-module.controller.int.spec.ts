import { Test, TestingModule } from '@nestjs/testing';
import { CastMembersController } from '../cast-members-module.controller';

import { DatabaseModule } from '../../database-module/database.module';
import { CastMembersModule } from '../cast-members-module.module';
import { CreateCastMemberDto } from '../dto/create-cast-member.dto';
import { CastMenberTypeEnum } from '../../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.input';
import { ConfigModule } from '../../config-module/config.module';
import {
  CastMember,
  CastMemberId,
} from '../../../core/cast-member/domain/cast-member.aggregate';
import { NotFoundError } from '../../../core/shared/domain/errors/notFoundError';
import { UpdateCastMemberDto } from '../dto/update-cast-member.dto';

describe('CastMembersModuleController', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CastMembersModule],
    }).compile();

    controller = module.get<CastMembersController>(CastMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a castMember', async () => {
    const data: CreateCastMemberDto = {
      name: 'Movie',
      type: CastMenberTypeEnum.ACTOR,
    };

    const result = await controller.create(data);

    expect(result.name).toBe(data.name);
    expect(result.type).toBe(data.type);
  });

  it('should find a castMember', async () => {
    const data: CreateCastMemberDto = {
      name: 'Movie',
      type: CastMenberTypeEnum.ACTOR,
    };

    const created = await controller.create(data);

    const result = await controller.findOne(created.cast_member_id);

    expect(result?.cast_member_id).toBe(created.cast_member_id);
    expect(result?.name).toBe(created.name);
    expect(result?.type).toBe(created.type);
  });

  it('should not find a castMember', async () => {
    const cast_member_id = new CastMemberId().toString();

    await expect(controller.findOne(cast_member_id)).rejects.toThrow(
      new NotFoundError(cast_member_id, CastMember),
    );
  });

  it('should search categories', async () => {
    const castMember1: CreateCastMemberDto = {
      name: 'Movie',
      type: CastMenberTypeEnum.ACTOR,
    };

    await controller.create(castMember1);

    const castMember2: CreateCastMemberDto = {
      name: 'Series',
      type: CastMenberTypeEnum.ACTOR,
    };

    await controller.create(castMember2);

    let result = await controller.search({ page: 1, per_page: 10 });

    expect(result.data.length).toBeGreaterThanOrEqual(2);
    expect(result.meta.total).toBeGreaterThanOrEqual(2);

    result = await controller.search({ filter: 'Series' });

    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expect(result.meta.total).toBeGreaterThanOrEqual(1);
    expect(result.data[0].name).toBe(castMember2.name);
  });

  it('should delete a castMember', async () => {
    const data: CreateCastMemberDto = {
      name: 'Movie',
      type: CastMenberTypeEnum.ACTOR,
    };

    const created = await controller.create(data);

    const result = await controller.delete(created.cast_member_id);

    expect(result).toBeUndefined();

    await expect(controller.findOne(created.cast_member_id)).rejects.toThrow(
      new NotFoundError(created.cast_member_id, CastMember),
    );
  });

  it('should not delete a castMember when it does not exist', async () => {
    const cast_member_id = new CastMemberId().toString();

    await expect(controller.delete(cast_member_id)).rejects.toThrow(
      new NotFoundError(cast_member_id, CastMember),
    );
  });

  it('should update a castMember', async () => {
    const data: CreateCastMemberDto = {
      name: 'Movie',
      type: CastMenberTypeEnum.ACTOR,
    };

    const created = await controller.create(data);

    const updateData: UpdateCastMemberDto = {
      name: 'Updated Movie',
      type: CastMenberTypeEnum.DIRECTOR,
    };

    const result = await controller.update(created.cast_member_id, updateData);

    expect(result.name).toBe(updateData.name);
    expect(result.type).toBe(updateData.type);
  });

  it('should not update a castMember when it does not exist', async () => {
    const cast_member_id = new CastMemberId().toString();

    await expect(
      controller.update(cast_member_id, { name: 'Updated Movie' }),
    ).rejects.toThrow(new NotFoundError(cast_member_id, CastMember));
  });
});
