import { CastMemberOutput } from '../../../core/cast-member/application/use-cases/common/cast-member-output';
import { CastMenberTypeEnum } from '../../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.input';
import { SearchCastMemberOutput } from '../../../core/cast-member/application/use-cases/search-cast-member/search-cast-member.use-case';
import { CastMember } from '../../../core/cast-member/domain/cast-member.aggregate';
import { CategoryId } from '../../../core/category/domain/category.aggregate';
import { NotFoundError } from '../../../core/shared/domain/errors/notFoundError';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';
import { CastMembersController } from '../cast-members-module.controller';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-members.presenter';
import { CreateCastMemberDto } from '../dto/create-cast-member.dto';
import { UpdateCastMemberDto } from '../dto/update-cast-member.dto';

describe('CastMembersController', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    controller = new CastMembersController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a castMember', async () => {
    //Arrange
    const output: CastMemberOutput = {
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      type: 'actor',
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateCastMemberDto = {
      name: 'Movie',
      type: CastMenberTypeEnum.ACTOR,
    };

    const result = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(result).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should find a castMember', async () => {
    //Arrange
    const output: CastMemberOutput = {
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      type: 'actor',
      created_at: new Date(),
    };

    const mockFindUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['findUseCase'] = mockFindUseCase;

    const result = await controller.findOne(output.cast_member_id);

    expect(result?.cast_member_id).toBe(output.cast_member_id);
    expect(result?.name).toBe(output.name);
    expect(result?.type).toBe(output.type);
  });

  it('should not find a castMember', async () => {
    const cast_member_id = new CategoryId().toString();

    const mockFindUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(null)),
    };

    //@ts-expect-error defined part of methods
    controller['findUseCase'] = mockFindUseCase;

    await expect(controller.findOne(cast_member_id)).rejects.toThrow(
      new NotFoundError(cast_member_id, CastMember),
    );
  });

  it('should search categories', async () => {
    const output: SearchCastMemberOutput = {
      items: [
        {
          cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          type: 'actor',
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockSearchUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['searchUseCase'] = mockSearchUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
    expect(mockSearchUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CastMemberCollectionPresenter(output));
  });

  it('should delete a castMember', async () => {
    const cast_member_id = new CategoryId().toString();

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(null)),
    };

    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;

    const result = await controller.delete(cast_member_id);

    expect(result).toBeNull();
  });

  it('should not delete a castMember when it does not exist', async () => {
    const cast_member_id = new CategoryId().toString();

    const mockDeleteUseCase = {
      execute: jest
        .fn()
        .mockReturnValue(
          Promise.reject(new NotFoundError(cast_member_id, CastMember)),
        ),
    };

    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;

    await expect(controller.delete(cast_member_id)).rejects.toThrow(
      new NotFoundError(cast_member_id, CastMember),
    );
  });

  it('should update a castMember', async () => {
    const cast_member_id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: CastMemberOutput = {
      cast_member_id,
      name: 'Movie',
      type: 'actor',
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateCastMemberDto = {
      name: 'Movie',
      type: CastMenberTypeEnum.ACTOR,
    };
    const presenter = await controller.update(cast_member_id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      cast_member_id,
      ...input,
    });

    console.log('Presenter returned from update:', presenter);

    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should not update a castMember when it does not exist', async () => {
    const cast_member_id = new CategoryId().toString();

    const mockUpdateUseCase = {
      execute: jest
        .fn()
        .mockReturnValue(
          Promise.reject(new NotFoundError(cast_member_id, CastMember)),
        ),
    };

    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;

    await expect(
      controller.update(cast_member_id, { name: 'Updated Movie' }),
    ).rejects.toThrow(new NotFoundError(cast_member_id, CastMember));
  });
});
