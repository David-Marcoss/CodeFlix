import { MaxLength } from 'class-validator';
import { Video } from './video.aggregate';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';

//criar um testes que verifique os decorators
export class VideoRules {
  @MaxLength(255, { groups: ['title'] })
  title!: string;

  constructor(entity: Video) {
    Object.assign(this, entity);
  }
}

export class VideoValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['title'];
    return super.validate(notification, new VideoRules(data), newFields);
  }
}

export class VideoValidatorFactory {
  static create() {
    return new VideoValidator();
  }
}
