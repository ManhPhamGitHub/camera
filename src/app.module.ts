import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { TypeOrmService } from '@configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Services from '@services';
import * as Controllers from '@controllers';
import * as Repositories from '@repositories';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@environments';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkerModule } from './worker/worker.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { MailModule } from './mail/mailer.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    JwtModule.register({
      secret: env.get('jwt.secret'),
      signOptions: {
        expiresIn: env.get('jwt.expirationTime'),
      },
    }),
    ScheduleModule.forRoot(),
    // MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '.', 'storage'),
      serveRoot: '/storage',
    }),
    WorkerModule,
  ],

  controllers: [AppController, ...Object.values(Controllers)],
  providers: [...Object.values(Repositories), ...Object.values(Services)],
})
export class AppModule {}
