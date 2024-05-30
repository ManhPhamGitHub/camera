import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CamService } from '@services';
@Injectable()
export class WorkerService {
  constructor(private readonly cameraService: CamService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const cameraUrl = 'rtsp://rtsp-test-server.viomic.com:554/stream'; // Replace with your RTSP URL
    await this.cameraService.startStreaming(cameraUrl);
  }
}
