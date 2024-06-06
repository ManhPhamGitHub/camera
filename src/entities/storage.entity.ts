import { Expose, plainToClass } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { CamConfig } from './camConfig.entity';
import { Provider } from '@entities';

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

  @ManyToOne(() => CamConfig, (camConfig) => camConfig.storages)
  @JoinColumn({ name: 'idCamConfig' })
  camConfig: CamConfig;

  constructor(storage: Partial<Storage>) {
    Object.assign(
      this,
      plainToClass(Storage, storage, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
