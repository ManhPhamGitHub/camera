import { Module } from '@nestjs/common';
import { CamConfigRepository, CamRepository } from '@repositories';
import { WorkerService, CamService } from '@services';

@Module({
  providers: [WorkerService, CamService, CamConfigRepository, CamRepository],
  controllers: [],
})
export class WorkerModule {}
