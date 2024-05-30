import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiDocs, ResponseInterceptor } from '@common';
import { CamConfigService, CamService, ProviderService } from '@services';
import { Cam, CamConfig } from '@entities';
@Controller('camera')
@ApiDocs({ isBearerAuth: true, tag: 'users' })
@UseInterceptors(new ResponseInterceptor())
export class UserController {
  private readonly httpService;
  constructor(
    private camService: CamService,
    private providerService: ProviderService,
    private camConfig: CamConfigService,
  ) {}

  @Get('check-connection')
  async checkConnection(
    @Query('url') url: string,
  ): Promise<{ success: boolean }> {
    const success = await this.camService.checkRtspConnection(url);
    return { success };
  }

  @Get('')
  async getCameras() {
    return this.camService.findAll({
      where: { active: true },
      relations: {
        camConfig: true,
      },
    });
  }

  @Post('')
  async createCamera(
    @Body()
    body: {
      name: string;
      ipAddress: string;
      description: string;
      input: string;
      output: string;
      provider: string;
    },
  ) {
    const cam = this.camService.insert(
      new Cam({
        ...body,
        active: true,
        startTime: new Date().toISOString(),
      }),
    );

    const provider = this.providerService.findOne({
      where: {
        name: body.provider,
      },
    });

    await this.camConfig.insert(
      new CamConfig({
        idCam: cam.id,
        idStorage: provider.id,
        input: body.input,
        output: body.output,
      }),
    );
  }
}
