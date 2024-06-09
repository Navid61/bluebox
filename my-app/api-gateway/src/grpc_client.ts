import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';


const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PROTO_PATH = path.join(__dirname, '../../shared/proto/service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = loadPackageDefinition(packageDefinition);
const mypackage = protoDescriptor.mypackage as any;

const client = new mypackage.MyService('localhost:50051', credentials.createInsecure());

function getUserData(userId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    client.GetUserData({ user_id: userId }, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function saveUser(name: string, age: number): Promise<any> {
  return new Promise((resolve, reject) => {
    client.SaveUser({ name, age }, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

export { getUserData, saveUser };
