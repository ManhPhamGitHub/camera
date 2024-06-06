import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { TypeOrmService } from '@configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Services from '@services';
import * as Controllers from '@controllers';
import * as Repositories from '@repositories';
import * as Mail from '@mail';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@environments';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkerModule } from './worker/worker.module';

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
    WorkerModule,
  ],

  controllers: [AppController, ...Object.values(Controllers)],
  providers: [
    ...Object.values(Repositories),
    ...Object.values(Services),
    ...Object.values(Mail),
  ],
})
export class AppModule {}
