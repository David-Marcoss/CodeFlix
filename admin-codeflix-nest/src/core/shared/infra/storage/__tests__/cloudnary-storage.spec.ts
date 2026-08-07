// import { Config } from '../../config';
// import { CloudnaryStorage } from '../claudnary.storage.';
// import { v2 as cloudinary } from 'cloudinary';

// describe('StorageInMemory', () => {
//   let storage: CloudnaryStorage;

//   beforeEach(() => {
//     const config = Config.cloudnaryCredentials();
//     cloudinary.config({
//       api_key: config.cloudnary_api_key,
//       api_secret: config.cloudnary_api_secret,
//       cloud_name: config.cloudnary_cloud_name,
//     });

//     storage = new CloudnaryStorage(cloudinary);
//   });

//   describe('store', () => {
//     it('should store data in the storage', async () => {
//       const data = Buffer.from('test data');
//       const id = 'test-id';
//       const mime_type = 'text/plain';

//       await storage.store({ data, id, mime_type });

//       const storedData = await storage.get(id);
//       expect(storedData).toEqual({ data, name: id });

//       await storage.deleteFile(id);
//     });
//   });

//   describe('get', () => {
//     it('should return the stored data', async () => {
//       const data = Buffer.from('test data');
//       const id = 'test-id';
//       const mime_type = 'text/plain';

//       await storage.store({ data, id, mime_type });

//       const result = await storage.get(id);
//       expect(result).toEqual({ data, name: id });

//       await storage.deleteFile(id);
//     });
//   });
// });
