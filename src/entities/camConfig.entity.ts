import { Expose, plainToClass } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Cam } from './cam.entity';
import { Storage } from './storage.entity';
import { Provider } from './provider.entity';
@Entity({ name: 'cam_config' })
export class CamConfig {
  @Column({ type: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  idCam: string;

  @Column()
  @Expose()
  input: string;

  @Column()
  @Expose()
  output: string;

  @OneToOne(() => Cam, (cam) => cam.camConfig)
  @JoinColumn({ name: 'idCam' })
  cam: Cam;

  @OneToMany(() => Storage, (storage) => storage.camConfig)
  storages: Storage[];

  @OneToOne(() => Provider, (provider) => provider.camConfig)
  provider: Provider;

  constructor(camConfig: Partial<CamConfig>) {
    Object.assign(
      this,
      plainToClass(CamConfig, camConfig, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
