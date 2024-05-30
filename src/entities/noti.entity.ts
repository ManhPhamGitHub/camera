import { Expose, plainToClass } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Cam } from './cam.entity';

@Entity({ name: 'noti' })
export class Noti {
  @Column({ type: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  channel: string;

  @Column({ type: 'json' })
  @Expose()
  config: any;

  @ManyToMany(() => Cam, (cam) => cam.notis)
  cams: Cam[];

  constructor(noti: Partial<Noti>) {
    Object.assign(
      this,
      plainToClass(Noti, noti, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
