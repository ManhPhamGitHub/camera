import { Expose, plainToClass } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

  constructor(camConfig: Partial<CamConfig>) {
    Object.assign(
      this,
      plainToClass(CamConfig, camConfig, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
