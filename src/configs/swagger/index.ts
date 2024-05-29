import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from '@environments';

export const configSwagger = (app: INestApplication) => {
  const NODE_ENV = env.get('environment') || 'development';

  if (NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('CMC Devops Cloud')
      .setDescription('CMC Devops Cloud API')
      .setVersion('1.0')
      .addServer(env.get('swagger.serverBaseUrl'))
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
};
