import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from '../cast-member-type.vo';
import { CastMember } from '../cast-member.aggregate';

describe('CastMember Unit Tests', () => {
  let validateSpy: any;

  beforeEach(() => {
    validateSpy = jest.spyOn(CastMember.prototype, 'validate');
  });

  afterEach(() => {
    validateSpy.mockRestore();
  });

  describe('constructor', () => {
    test('should create a castMember with default values', () => {
      const type = new CastMemberType('actor');
      const castMember = new CastMember({
        name: 'Movie',
        type,
      });

      expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
      expect(castMember.name).toBe('Movie');
      expect(castMember.type).toBe(type);
      expect(castMember.created_at).toBeInstanceOf(Date);
    });

    test('should create a castMember with all values', () => {
      const created_at = new Date();
      const type = new CastMemberType('actor');
      const cast_member_id = new Uuid();
      const castMember = new CastMember({
        cast_member_id,
        name: 'Movie',
        type,
        created_at,
      });

      expect(castMember.cast_member_id.equals(cast_member_id)).toBe(true);
      expect(castMember.name).toBe('Movie');
      expect(castMember.type).toBe(type);
      expect(castMember.created_at).toBe(created_at);
    });

    test('should create a castMember with name and type', () => {
      const type = new CastMemberType('actor');
      const castMember = new CastMember({
        name: 'Movie',
        type,
      });

      expect(castMember.name).toBe('Movie');
      expect(castMember.type).toBe(type);
      expect(castMember.created_at).toBeInstanceOf(Date);
    });
  });

  describe('create command', () => {
    test('should create a castMember', () => {
      const type = new CastMemberType('actor');
      const castMember = CastMember.create({
        name: 'Movie',
        type,
      });

      expect(castMember.name).toBe('Movie');
      expect(castMember.type).toBe(type);
      expect(castMember.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('cast_member_id field', () => {
    const arrange = [
      { cast_member_id: null },
      { cast_member_id: undefined },
      { cast_member_id: new Uuid() },
    ];

    test.each(arrange)('id = %j', ({ cast_member_id }) => {
      const type = new CastMemberType('actor');
      const castMember = new CastMember({
        name: 'Movie',
        type,
        cast_member_id: cast_member_id as any,
      });

      expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    });
  });

  test('should change name', () => {
    const type = new CastMemberType('actor');
    const castMember = CastMember.create({
      name: 'Movie',
      type,
    });
    castMember.changeName('other name');

    expect(castMember.name).toBe('other name');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });
});

describe('CastMember Validator', () => {
  describe('create command', () => {
    test('should an invalid castMember with name property', () => {
      const type = new CastMemberType('actor');
      const castMember = CastMember.create({
        name: 't'.repeat(256),
        type,
      });

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should a invalid castMember using name property', () => {
      const type = new CastMemberType('actor');
      const castMember = CastMember.create({
        name: 'Movie',
        type,
      });
      castMember.changeName('t'.repeat(256));

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
