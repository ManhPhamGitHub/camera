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
      // where: {  },
      relations: {
        cam: true,
        provider: true,
      },
    });

    // const cameraUrl = 'rtsp://rtsp-test-server.viomic.com:554/stream'; // Replace with your RTSP URL
    for (const camConfig of listCamera) {
      if (!camConfig.provider) {
        throw new Error('Provider not found');
      }
      await this.cameraService.startStreaming(camConfig);
    }
  }
}
