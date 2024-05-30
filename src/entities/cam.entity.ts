import { Expose, plainToClass } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { CamConfig } from './camConfig.entity';
import { Noti } from './noti.entity';

@Entity({ name: 'cam' })
export class Cam {
  @Column({ type: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  ipAddress: string;

  @Column()
  @Expose()
  startTime: string;

  @Column()
  @Expose()
  endTime: string;

  @Column()
  @Expose()
  description: string;

  @Column({ default: false })
  @Expose()
  active: boolean;

  @OneToOne(() => CamConfig, (camConfig) => camConfig.cam)
  @JoinColumn({ name: 'idCam' })
  camConfig: CamConfig;

  @ManyToMany(() => Noti, (noti) => noti.cams)
  @JoinTable({
    name: 'cam_noti',
    joinColumn: { name: 'idCam', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idNoti', referencedColumnName: 'id' },
  })
  notis: Noti[];

  constructor(cam: Partial<Cam>) {
    Object.assign(
      this,
      plainToClass(Cam, cam, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
