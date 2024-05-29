import { Expose, plainToClass } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'storage' })
export class Storage {
  @Column({ type: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  url: string;

  @Column()
  @Expose()
  path: string;

  @Column()
  @Expose()
  link: string;

  @Column()
  @Expose()
  idCam: string;

  @Column()
  @Expose()
  idProvider: string;

  constructor(storage: Partial<Storage>) {
    Object.assign(
      this,
      plainToClass(Storage, storage, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
