import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger, CustomLogger } from '@configs';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

import { env } from '@environments';
import {
  LoggingInterceptor,
  TimeoutInterceptor,
  ValidationPipe,
  GlobalExceptionFilter,
} from '@common';
import {
  RequestMethod,
  VersioningType,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new CustomLogger(),
    cors: true,
  });

  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );

  // app.use(
  //   rateLimit({
  //     windowMs: 1000 * 60 * 60,
  //     max: env.get('rateLimit'),
  //     message:
  //       '⚠️  Too many request created from this IP, please try again after an hour',
  //   }),
  // );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());

  app.enableShutdownHooks();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Add prefix path
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health-check', method: RequestMethod.GET }],
  });

  // Config swagger
  configSwagger(app);

  // Config microservices
  //GrpcConfig.setupMicroservicesGrpc(app, GRPC_SERVICES);
  app.useStaticAssets(join(__dirname, '..', 'storage'));

  await app.startAllMicroservices();

  await app.listen(env.get('port'));
}
bootstrap();
