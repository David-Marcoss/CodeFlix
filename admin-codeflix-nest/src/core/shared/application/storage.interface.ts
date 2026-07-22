export interface IStorage {
  get(id: string): Promise<{ data: Buffer; name: string; mime_type?: string }>;
  store(object: {
    id: string;
    data: Buffer;
    mime_type?: string;
  }): Promise<void>;
}
