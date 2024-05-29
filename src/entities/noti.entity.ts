import { Expose, plainToClass } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

  constructor(noti: Partial<Noti>) {
    Object.assign(
      this,
      plainToClass(Noti, noti, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
