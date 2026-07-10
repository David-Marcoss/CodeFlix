import { AggregateRoot } from '../aggregate-root';
import { IDomainEvent } from '../events/domain-events.interface';
import { ValueObject } from '../value-object';
import { Uuid } from '../value-objects/uuid.vo';

class StubEvent implements IDomainEvent {
  aggregate_id: ValueObject;
  occurred_on = new Date();
  event_version = 1;

  constructor(
    aggregate_id: ValueObject,
    public name: string,
  ) {
    this.aggregate_id = aggregate_id;
    this.name;
  }
}

class StubAggregateRoot extends AggregateRoot {
  aggregate_id: Uuid;
  name: string;
  nameChanged: boolean = false;

  constructor(name: string, id?: Uuid) {
    super();
    this.aggregate_id = id || new Uuid();
    this.name = name;

    // cria o handler para o evento de mudança de nome
    this.registerHandler(StubEvent.name, this.onChangeNameEvent.bind(this));
  }

  changeName(name: string): void {
    this.name = name;
    // dispara o evento de mudança de nome
    this.applyEvent(new StubEvent(this.aggregate_id, this.name));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeNameEvent(_event: StubEvent): void {
    this.nameChanged = true;
  }

  get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }
  toJSON() {
    throw new Error('Method not implemented.');
  }
}

describe('Domain Events', () => {
  it('should execute the handler when the event is applied', () => {
    const aggregate = new StubAggregateRoot('John Doe');
    aggregate.changeName('Jane Doe');
    expect(aggregate.nameChanged).toBe(true);
  });
});
