export interface IStorage {
  deleteFile(id: string, mimeType?: string): Promise<void>;
  get(id: string): Promise<{ data: Buffer; name: string; mime_type?: string }>;
  store(object: {
    id: string;
    data: Buffer;
    mime_type?: string;
  }): Promise<{ url: string }>;
}
