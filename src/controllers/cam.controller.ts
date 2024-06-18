import {
  Body,
  Controller,
  Get,
  Param,
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
      id?: string;
      name?: string;
      ipAddress?: string;
      description?: string;
      input?: string;
      output?: string;
      providerName?: string;
      fileDirection?: string;
      identify?: any;
      config?: any;
    },
  ) {
    if (body.id) {
      const existCamConfig = await this.camConfig.findOne({
        where: {
          id: body.id,
        },
        relations: {
          provider: true,
        },
      });

      if (!existCamConfig) {
        throw new Error('Cam Config not found');
      }
      await this.camConfig.insert({
        ...existCamConfig,
        input: body.input,
        output: body.output,
      });

      const existCam = await this.camService.findOne({
        where: {
          id: existCamConfig.idCam,
        },
      });

      await this.camService.insert({
        ...existCam,
        name: body.name,
        description: body.description,
      });

      const existProvider = await this.providerService.findOne({
        where: {
          id: existCamConfig.provider.id,
        },
      });
      const providerPayload = {
        name: `${body.providerName}-${body.name}`,
        providerName: body.providerName,
        fileDirection: body.fileDirection,
        config: body.config,
      };
      if (body.identify) {
        providerPayload['identify'] = JSON.stringify(body.identify);
      }
      console.log('providerPayload', providerPayload);

      console.log('existProvider,', existProvider);

      console.log(22, {
        ...existProvider,
        ...providerPayload,
      });

      await this.providerService.insert({
        ...existProvider,
        ...providerPayload,
      });
    } else {
      {
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
    }
  }

  @Put('/:id')
  async updateCameraNoti(
    @Body() body: { channel: string; config: string; idCam: string },
    @Param('id') id: string,
  ) {
    const existNoti = await this.notiService.findOne({
      where: {
        idCam: body.idCam,
        channel: body.channel,
      },
    });
    if (existNoti) {
      throw new Error('Noti already exist');
    }
    const noti = await this.notiService.insert(
      new Noti({
        idCam: body.idCam,
        channel: body.channel,
        config: body.config,
      }),
    );
  }

  @Get('/config')
  async getCamStorage(@Query('id') id: string) {
    const camConfigs = await this.camConfig.findAll({
      where: { idCam: id },
      relations: {
        provider: true,
        storages: true,
        cam: true,
      },
    });
    return Promise.all(
      camConfigs.map(async (camConfig) => {
        const notis = await this.notiService.findAll({
          where: {
            idCam: camConfig.idCam,
          },
        });
        delete camConfig.provider.identify;
        return {
          ...camConfig,
          notis,
        };
      }),
    );
  }
}
