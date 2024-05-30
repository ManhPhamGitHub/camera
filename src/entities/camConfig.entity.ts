import { Expose, plainToClass } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Cam } from './cam.entity';
import { Storage } from './storage.entity';
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

  @Column()
  @Expose()
  idStorage: string;

  @OneToOne(() => Cam, (cam) => cam.camConfig)
  @JoinColumn({ name: 'idCam' })
  cam: Cam;

  @OneToOne(() => Storage, (storage) => storage.camConfig)
  @JoinColumn({ name: 'idStorage' })
  storage: Storage;

  constructor(camConfig: Partial<CamConfig>) {
    Object.assign(
      this,
      plainToClass(CamConfig, camConfig, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
