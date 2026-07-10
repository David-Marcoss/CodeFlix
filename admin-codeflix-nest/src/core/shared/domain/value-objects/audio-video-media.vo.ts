import { ValueObject } from '../value-object';

export enum AudioVideoMediaStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export abstract class AudioVideoMedia extends ValueObject {
  name: string;
  raw_location: string;
  encoded_location: string | null;
  status: AudioVideoMediaStatus;
  constructor({
    name,
    raw_location,
    encoded_location,
    status,
  }: {
    name: string;
    raw_location: string;
    encoded_location?: string;
    status: AudioVideoMediaStatus;
  }) {
    super();
    this.name = name;
    this.raw_location = raw_location;
    this.status = status;
    this.encoded_location = encoded_location ?? null;
  }

  get url(): string {
    return `${this.raw_location}/${this.name}`;
  }

  toJSON() {
    return {
      name: this.name,
      raw_location: this.raw_location,
      encoded_location: this.encoded_location,
    };
  }
}
