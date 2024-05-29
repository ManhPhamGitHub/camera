import { Expose, plainToClass } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

  constructor(cam: Partial<Cam>) {
    Object.assign(
      this,
      plainToClass(Cam, cam, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
