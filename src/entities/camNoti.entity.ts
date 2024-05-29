import { Expose, plainToClass } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

  constructor(camNoti: Partial<CamNoti>) {
    Object.assign(
      this,
      plainToClass(CamNoti, camNoti, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
