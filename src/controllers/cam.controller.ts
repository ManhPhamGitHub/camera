import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiDocs, ResponseInterceptor } from '@common';
import {
  CamConfigService,
  CamService,
  NotiService,
  ProviderService,
  StorageService,
} from '@services';
import { Cam, CamConfig, Noti, Provider, StorageEntity } from '@entities';

@Controller('camera')
@ApiDocs({ isBearerAuth: true, tag: '' })
@UseInterceptors(new ResponseInterceptor())
export class UserController {
  private readonly httpService;
  constructor(
    private camService: CamService,
    private providerService: ProviderService,
    private camConfig: CamConfigService,
    private storageService: StorageService,
    private notiService: NotiService,
  ) {}

  @Get('check-connection')
  async checkConnection(
    @Query('url') url: string,
  ): Promise<{ status: boolean }> {
    const success = await this.camService.checkRtspConnection(url);
    return { status: success };
  }

  @Get('')
  async getCameras() {
    return this.camService.findAll({
      where: { active: true },
      relations: {
        camConfig: true,
        notis: true,
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
      providerName: string;
      fileDirection: string;
      identify: any;
      config: any;
    },
  ) {
    const cam = await this.camService.insert(
      new Cam({
        ...body,
        active: true,
        startTime: new Date().toISOString(),
      }),
    );

    const camConfig = await this.camConfig.insert(
      new CamConfig({
        idCam: cam.id,
        input: body.input,
        output: body.output,
      }),
    );

    const provider = await this.providerService.insert(
      new Provider({
        name: `${body.providerName}-${body.name}`,
        providerName: body.providerName,
        fileDirection: body.fileDirection,
        identify: JSON.stringify(body.identify),
        idCamConfig: camConfig.id,
        config: JSON.stringify(body.config),
      }),
    );
  }

  @Put('/:id')
  async updateCameraNoti(
    @Body() body: { channel: string; config: string },
    @Query('id') id: string,
  ) {
    const noti = await this.notiService.insert(
      new Noti({
        idCam: id,
        channel: body.channel,
        config: body.config,
      }),
    );
  }

  @Get('/config')
  async getCamStorage(@Query('id') id: string) {
    return await this.camConfig.findAll({
      where: { idCam: id },
      relations: {
        provider: true,
        storages: true,
        cam: true,
      },
    });
  }
}
