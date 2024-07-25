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
import { BaseService } from '../services/base.service';
import env from '@environments';

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
      resolution?: string;
      crf?: string;
      active?: boolean;
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
        crf: body.crf,
        resolution: body.resolution,
      });

      const existCam = await this.camService.findOne({
        where: {
          id: existCamConfig.idCam,
        },
      });
      let activeCamera = existCam.active;
      if (body.active !== null && body.active !== undefined) {
        activeCamera = body.active;
      }

      await this.camService.insert({
        ...existCam,
        name: body.name || existCam.name,
        description: body.description || existCam.description,
        active: activeCamera,
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

        this.camService.startStreaming(camConfig);
      }
    }
  }

  @Put('/:id')
  async updateCameraNoti(
    @Body() body: { channel: string; config: any; idCam: string },
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
  async getCamStorage(
    @Query('id') id: string,
    @Query('active') active: boolean = true,
  ) {
    const query = active === true ? { cam: { active: active } } : {};
    console.log('query', query);

    const camConfigs = await this.camConfig.findAll({
      where: { idCam: id, ...query },
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
        if (camConfig.provider?.identify) delete camConfig.provider.identify;
        return {
          ...camConfig,
          notis,
        };
      }),
    );
  }

  @Put('/:id/noti')
  async createNoti(
    @Param('id') id: string,
    @Body()
    body: any,
  ) {
    return await Promise.all(
      body.map(async (item) => {
        if (!item.idCam) return;
        const existNoti = await this.notiService.findOne({
          where: {
            id: item.id,
          },
        });
        if (existNoti) {
          await this.notiService.insert({
            ...existNoti,
            channel: item.channel,
            config: item.config,
          });
        } else {
          await this.notiService.insert(
            new Noti({
              idCam: item.idCam,
              channel: item.channel,
              config: item.config,
            }),
          );
        }
      }),
    );
  }

  @Get('/callback')
  async CallbackTest(@Query('code') code: string) {
    console.log('code', code);

    const CLIENT_ID = 'Iv23li5gpJsQgYqCfUEX';
    const CLIENT_SECRET = env.get('github_client_secret');
    const baseServiceGithub = new BaseService(
      'https://github.com/login/oauth/access_token',
    );
    const baseServiceGitlab = new BaseService('https://gitlab.com/oauth/token');

    const response: any = await baseServiceGithub.post('', {
      client_id:
        CLIENT_ID ||
        '5bfd621387a641d5fc19be4fb451005852bd78558919cbf607093ae617cb93b7',
      client_secret: CLIENT_SECRET || env.get('gitlab_client_secret'),
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://42.96.58.232:8000/api/v1/camera/callback',
    });
    console.log('response', response);
    // const accessToken = response.data
    //   .split('&')[0]
    //   .replace('access_token=', '');
    // console.log('accessToken', accessToken);
    const accessToken = response.data.access_token;

    const baseService1 = new BaseService('https://api.github.com/user');

    const test: any = await baseService1.get('', {
      headers: { Authorization: `token ${accessToken}` },
    });
    console.log('test', test.data);
    console.log('responseresponse', response);

    return { code };
  }
}
