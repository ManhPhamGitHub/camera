import { IGrpcConfig } from '@configs';

export const GRPC_SERVICES: IGrpcConfig[] = [
  {
    name: 'ORDERS',
    url: '0.0.0.0:8090',
    protoPath: 'src/grpc/proto/order.proto',
  },
];
