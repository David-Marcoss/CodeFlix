// Fixures: Mapeia conjunto de dados a serem usados para a execulção dos testes

import { CastMemberType } from '../../../core/cast-member/domain/cast-member-type.vo';
import { CastMember } from '../../../core/cast-member/domain/cast-member.aggregate';

const _keysInResponse = ['category_id', 'name', 'type', 'created_at'];

export class GetCastMemberFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateCastMemberFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForCreate() {
    const faker = CastMember.fake()
      .aCastMember()
      .withName('Movie')
      .withType(new CastMemberType('actor'));
    return [
      {
        send_data: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
          type: null,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: faker.type,
        },
        expected: {
          name: faker.name,
          type: faker.type,
        },
      },
      {
        send_data: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
          type: null,
        },
      },
      {
        send_data: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
          type: null,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: faker.type,
        },
        expected: {
          name: faker.name,
          type: faker.type,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: undefined,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: null,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: '',
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          type: 5,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'type must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          is_active: 'a',
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().aCastMember();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateCastMemberFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForUpdate() {
    const faker = CastMember.fake()
      .aCastMember()
      .withName('Movie')
      .withType(new CastMemberType('actor'));
    return [
      {
        send_data: {
          name: faker.name,
          type: null,
        },
        expected: {
          name: faker.name,
          type: null,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: faker.type,
        },
        expected: {
          name: faker.name,
          type: faker.type,
        },
      },
      {
        send_data: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          type: 5,
        },
        expected: {
          message: ['type must be a string'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().aCastMember();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListCategoriesFixture {
  static arrangeIncrementedWithCreatedAt() {
    const baseDate = new Date(Math.floor(Date.now() / 1000) * 1000);
    const _entities = CastMember.fake()
      .theCategories(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(baseDate.getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const baseDate = new Date(Math.floor(Date.now() / 1000) * 1000);
    const faker = CastMember.fake().aCastMember().withCreatedAt(baseDate);

    const entitiesMap = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.AAA, entitiesMap.AaA],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.a],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
