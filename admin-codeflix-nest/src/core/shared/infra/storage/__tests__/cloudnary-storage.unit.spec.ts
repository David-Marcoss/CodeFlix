import { v2 as cloudinary } from 'cloudinary';
import { CloudnaryStorage } from '../claudnary.storage.';

describe('CloudnaryStorage upload', () => {
  it.each(['image/png', 'video/mp4'])(
    'returns secure_url for %s',
    async (mime_type) => {
      const data = Buffer.from('file');
      const end = jest.fn();
      const upload_stream = jest
        .fn()
        .mockImplementation((options, callback) => {
          callback(null, {
            secure_url: 'https://res.cloudinary.com/demo/file',
          });
          return { end };
        });
      const storage = new CloudnaryStorage({
        uploader: { upload_stream },
      } as unknown as typeof cloudinary);
      await expect(
        storage.store({ id: 'videos/id/file', data, mime_type }),
      ).resolves.toEqual({ url: 'https://res.cloudinary.com/demo/file' });
      expect(upload_stream).toHaveBeenCalledWith(
        expect.objectContaining({
          resource_type: mime_type.startsWith('image') ? 'image' : 'video',
          public_id: 'videos/id/file',
        }),
        expect.any(Function),
      );
      expect(end).toHaveBeenCalledWith(data);
    },
  );

  it('propagates upload errors', async () => {
    const upload_stream = jest.fn().mockImplementation((options, callback) => {
      callback(new Error('Cloudinary unavailable'));
      return { end: jest.fn() };
    });
    const storage = new CloudnaryStorage({
      uploader: { upload_stream },
    } as unknown as typeof cloudinary);
    await expect(
      storage.store({ id: 'file', data: Buffer.from('file') }),
    ).rejects.toThrow('Cloudinary unavailable');
  });
});
