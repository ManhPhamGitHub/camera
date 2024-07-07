import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CamConfigRepository } from '@repositories';
import { CamConfigService, CamService } from '@services';
@Injectable()
export class WorkerService {
  constructor(
    private readonly camConfigRepository: CamConfigRepository,
    private readonly cameraService: CamService,
  ) {
    this.handleCron();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const listCamera = await this.camConfigRepository.findAll({
      where: {
        cam: {
          active: true,
        },
      },
      relations: {
        cam: true,
        provider: true,
      },
    });

    for (const camConfig of listCamera) {
      if (!camConfig.provider) {
        console.log('Provider not found');
        return;
      }
      await this.cameraService.startStreaming(camConfig);
    }
  }
}
