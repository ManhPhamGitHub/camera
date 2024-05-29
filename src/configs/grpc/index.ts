import {
  ClientsModule,
  Transport,
  MicroserviceOptions,
} from '@nestjs/microservices';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';

export interface IGrpcConfig {
  name: string;
  url: string;
  protoPath: string;
}

class GrpcConfigClass {
  connectClientsGrpc(services: IGrpcConfig[]) {
    const arrayServices = [];
    services.map((service) => {
      arrayServices.push({
        name: service.name,
        transport: Transport.GRPC,
        options: {
          url: service.url,
          package: service.name,
          protoPath: join(process.cwd(), service.protoPath),
        },
      });
    });
    return ClientsModule.register(arrayServices);
  }

  setupMicroserviceGrpc(app: INestApplication, service: IGrpcConfig) {
    console.log(
      'Loaded proto file path: ',
      join(process.cwd(), service.protoPath),
    );
    return app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: service.name,
        protoPath: join(process.cwd(), service.protoPath),
        url: service.url,
      },
    });
  }

  setupMicroservicesGrpc(app: INestApplication, services: IGrpcConfig[]) {
    services.map((service) => {
      this.setupMicroserviceGrpc(app, service);
    });
  }
}

export const GrpcConfig = new GrpcConfigClass();
