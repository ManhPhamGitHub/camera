import { MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import {
  CamConfigRepository,
  CamRepository,
  NotiRepository,
  StorageRepository,
} from '@repositories';
import { CamService } from '@services';
import { WorkerService } from 'src/services/worker.service';

@Module({
  providers: [
    WorkerService,
    CamService,
    CamConfigRepository,
    CamRepository,
    StorageRepository,
    NotiRepository,
    // MailerService,
  ],
  controllers: [],
})
export class WorkerModule {}
