// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var service_pb = require('./service_pb.js');

function serialize_mypackage_GetUserDataRequest(arg) {
  if (!(arg instanceof service_pb.GetUserDataRequest)) {
    throw new Error('Expected argument of type mypackage.GetUserDataRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mypackage_GetUserDataRequest(buffer_arg) {
  return service_pb.GetUserDataRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_mypackage_GetUserDataResponse(arg) {
  if (!(arg instanceof service_pb.GetUserDataResponse)) {
    throw new Error('Expected argument of type mypackage.GetUserDataResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mypackage_GetUserDataResponse(buffer_arg) {
  return service_pb.GetUserDataResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_mypackage_SaveUserRequest(arg) {
  if (!(arg instanceof service_pb.SaveUserRequest)) {
    throw new Error('Expected argument of type mypackage.SaveUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mypackage_SaveUserRequest(buffer_arg) {
  return service_pb.SaveUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_mypackage_SaveUserResponse(arg) {
  if (!(arg instanceof service_pb.SaveUserResponse)) {
    throw new Error('Expected argument of type mypackage.SaveUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mypackage_SaveUserResponse(buffer_arg) {
  return service_pb.SaveUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var MyServiceService = exports.MyServiceService = {
  // Define your service methods here:
getUserData: {
    path: '/mypackage.MyService/GetUserData',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.GetUserDataRequest,
    responseType: service_pb.GetUserDataResponse,
    requestSerialize: serialize_mypackage_GetUserDataRequest,
    requestDeserialize: deserialize_mypackage_GetUserDataRequest,
    responseSerialize: serialize_mypackage_GetUserDataResponse,
    responseDeserialize: deserialize_mypackage_GetUserDataResponse,
  },
  saveUser: {
    path: '/mypackage.MyService/SaveUser',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.SaveUserRequest,
    responseType: service_pb.SaveUserResponse,
    requestSerialize: serialize_mypackage_SaveUserRequest,
    requestDeserialize: deserialize_mypackage_SaveUserRequest,
    responseSerialize: serialize_mypackage_SaveUserResponse,
    responseDeserialize: deserialize_mypackage_SaveUserResponse,
  },
};

exports.MyServiceClient = grpc.makeGenericClientConstructor(MyServiceService);
