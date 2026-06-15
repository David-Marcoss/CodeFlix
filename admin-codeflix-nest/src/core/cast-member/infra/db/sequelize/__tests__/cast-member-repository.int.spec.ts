import { CastMemberModel } from '../cast-member.model';
import { CastMemberFakeBuilder } from '../../../../domain/category-fake.builder';
import { CastMemberSequelizeRepository } from '../cast-member-sequelize.repository';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { CastMemberType } from '../../../../domain/cast-member-type.vo';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../../domain/cast-member.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';
import { setupSequelize } from '../../../../../shared/infra/testing/helper';

describe('CastMember repository integration tests', () => {
  let castMemberRepository: CastMemberSequelizeRepository;
  setupSequelize({
    models: [CastMemberModel],
  });

  beforeEach(async () => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should create a new cast member', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .build();

    await castMemberRepository.create(castMember);

    const castMemberModel = await CastMemberModel.findByPk(
      castMember.cast_member_id.id,
    );

    expect(castMemberModel!.toJSON()).toStrictEqual({
      cast_member_id: castMember.cast_member_id.id,
      name: castMember.name,
      type: castMember.type.toString(),
      created_at: castMember.created_at,
    });
  });

  it('should find a cast member', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .build();

    await castMemberRepository.create(castMember);

    const findCastMember = await castMemberRepository.getById(
      castMember.cast_member_id,
    );

    expect(findCastMember!.toJSON()).toEqual(castMember.toJSON());
  });

  it('should find all cast members', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .withCreatedAt(new Date('2020-01-01T00:00:00.000Z'))
      .build();
    const castMember2 = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('director'))
      .withCreatedAt(new Date('2020-01-02T00:00:00.000Z'))
      .build();

    await castMemberRepository.create(castMember);
    await castMemberRepository.create(castMember2);

    const findCastMembers = await castMemberRepository.getAll();

    expect(findCastMembers.length).toBe(2);
    expect(findCastMembers[0].toJSON()).toEqual(castMember.toJSON());
    expect(findCastMembers[1].toJSON()).toEqual(castMember2.toJSON());
  });

  it('should find all cast members with pagination', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .withCreatedAt(new Date('2020-01-01T00:00:00.000Z'))
      .build();
    const castMember2 = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('director'))
      .withCreatedAt(new Date('2020-01-02T00:00:00.000Z'))
      .build();

    await castMemberRepository.create(castMember);
    await castMemberRepository.create(castMember2);

    const result = await castMemberRepository.search(
      new CastMemberSearchParams(),
    );

    expect(result).toEqual(
      new CastMemberSearchResult({
        items: [castMember2, castMember],
        total: 2,
        current_page: 1,
        per_page: 15,
      }),
    );
  });

  it('should delete a cast member', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .build();

    await castMemberRepository.create(castMember);

    const findCastMember = await castMemberRepository.getById(
      castMember.cast_member_id,
    );

    expect(findCastMember!.toJSON()).toEqual(castMember.toJSON());

    await castMemberRepository.delete(castMember.cast_member_id);

    const findCastMemberDeleted = await castMemberRepository.getById(
      castMember.cast_member_id,
    );

    expect(findCastMemberDeleted).toBeNull();
  });

  it('should to throw error when delete cast member is not found', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .build();

    await expect(
      castMemberRepository.delete(castMember.cast_member_id),
    ).rejects.toThrow(
      new NotFoundError(castMember.cast_member_id.id, CastMember),
    );
  });

  it('should update a cast member', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .build();

    await castMemberRepository.create(castMember);

    const findCastMember = await castMemberRepository.getById(
      castMember.cast_member_id,
    );

    expect(findCastMember!.toJSON()).toEqual(castMember.toJSON());

    const castMemberUpdated = new CastMember({
      cast_member_id: castMember.cast_member_id,
      name: 'updated name',
      type: new CastMemberType('director'),
      created_at: castMember.created_at,
    });

    await castMemberRepository.update(castMemberUpdated);

    const findCastMemberUpdated = await castMemberRepository.getById(
      castMember.cast_member_id,
    );

    expect(findCastMemberUpdated!.toJSON()).toEqual(castMemberUpdated.toJSON());
  });

  it('should to throw error when update cast member is not found', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .build();

    await expect(castMemberRepository.update(castMember)).rejects.toThrow(
      new NotFoundError(castMember.cast_member_id.id, CastMember),
    );
  });
});
