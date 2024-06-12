import { Module } from '@nestjs/common';
import { CamConfigRepository, CamRepository } from '@repositories';
import { CamService } from '@services';
import { WorkerService } from 'src/services/worker.service';

@Module({
  providers: [WorkerService, CamService, CamConfigRepository, CamRepository],
  controllers: [],
})
export class WorkerModule {}
