import { Expose, plainToClass } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Cam } from './cam.entity';
import { Noti } from './noti.entity';

@Entity({ name: 'cam_noti' })
export class CamNoti {
  @Column({ type: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  idCam: string;

  @Column()
  @Expose()
  idNoti: string;

  @ManyToOne(() => Cam, (cam) => cam.notis)
  @JoinColumn({ name: 'idCam' })
  cam: Cam;

  @ManyToOne(() => Noti, (noti) => noti.cams)
  @JoinColumn({ name: 'idNoti' })
  noti: Noti;

  constructor(camNoti: Partial<CamNoti>) {
    Object.assign(
      this,
      plainToClass(CamNoti, camNoti, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
