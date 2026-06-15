import { Sequelize } from 'sequelize-typescript';
import { CastMemberType } from '../../../../domain/cast-member-type.vo';
import { CastMemberFakeBuilder } from '../../../../domain/category-fake.builder';
import { CastMemberModel } from '../cast-member.model';

describe('CastMember model integration tests', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [CastMemberModel],
    });

    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('validate cast member model props', () => {
    const castMemberProps = Object.keys(CastMemberModel.getAttributes());
    expect(castMemberProps).toEqual([
      'cast_member_id',
      'name',
      'type',
      'created_at',
    ]);
  });

  it('should create a cast member', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(new CastMemberType('actor'))
      .build();

    const castMemberModel = await CastMemberModel.create({
      cast_member_id: castMember.cast_member_id.id,
      name: castMember.name,
      type: castMember.type.toString(),
      created_at: castMember.created_at,
    });

    expect(castMemberModel.toJSON()).toStrictEqual({
      cast_member_id: castMember.cast_member_id.id,
      name: castMember.name,
      type: castMember.type.toString(),
      created_at: castMember.created_at,
    });
  });
});
