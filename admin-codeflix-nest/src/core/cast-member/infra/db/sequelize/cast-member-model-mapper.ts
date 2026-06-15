import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from '../../../domain/cast-member-type.vo';
import { CastMember } from '../../../domain/cast-member.aggregate';
import { CastMemberModel, CastMemberTypeEnum } from './cast-member.model';

export class CastMemberModelMapper {
  static toModel(entity: CastMember): CastMemberModel {
    return CastMemberModel.build({
      cast_member_id: entity.cast_member_id.id,
      name: entity.name,
      type:
        entity.type.toString() === 'actor'
          ? CastMemberTypeEnum.ACTOR
          : CastMemberTypeEnum.DIRECTOR,
      created_at: entity.created_at,
    });
  }

  static toEntity(model: CastMemberModel): CastMember {
    const category = new CastMember({
      cast_member_id: new Uuid(model.cast_member_id),
      name: model.name,
      type: new CastMemberType(model.type),
      created_at: model.created_at,
    });

    category.validate();
    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }
    return category;
  }
}
