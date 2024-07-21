import express from 'express';
import bodyParser from 'body-parser';
import { Server, ServerCredentials, loadPackageDefinition } from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

// Initialize Express app
const app = express();
const port = 5001;

app.use(bodyParser.json());

// Express.js route example
app.get('/', (req, res) => {
  res.send('Hello from Express.js!');
});

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

// gRPC server setup
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PROTO_PATH = path.join(__dirname, '../../../shared/proto/service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = loadPackageDefinition(packageDefinition);
const mypackage = protoDescriptor.mypackage as any;

const grpcServer = new Server();

grpcServer.addService(mypackage.MyService.service, {
  GetUserData: (call: any, callback: any) => {
    const response = { name: 'John Doe', age: 30 };
    callback(null, response);
  },
  SaveUser: (call: any, callback: any) => {
    const response = { message: 'User saved successfully' };
    callback(null, response);
  },
});

const GRPC_PORT = '50051';
grpcServer.bindAsync(`0.0.0.0:${GRPC_PORT}`, ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server running at http://0.0.0.0:${GRPC_PORT}`);
  grpcServer.start();
});
