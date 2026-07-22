import { IStorage } from '../../application/storage.interface';

export class StorageInMemory implements IStorage {
  private storage = new Map<
    string,
    {
      data: Buffer;
      mime_type?: string;
    }
  >();

  async get(
    id: string,
  ): Promise<{ data: Buffer; name: string; mime_type?: string }> {
    const data = this.storage.get(id);

    if (!data) {
      throw Error(`File ${id} not found`);
    }

    return { ...data, name: id };
  }

  async store(object: {
    id: string;
    data: Buffer;
    mime_type?: string;
  }): Promise<void> {
    this.storage.set(object.id, {
      data: object.data,
      mime_type: object.mime_type,
    });
  }
}
