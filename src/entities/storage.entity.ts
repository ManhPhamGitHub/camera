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

  @Column()
  @Expose()
  idCam: string; // TODO FIX idCamConfig , relation one camConfig - many storage

  @Column()
  @Expose()
  idProvider: string;

  @OneToOne(() => CamConfig, (camConfig) => camConfig.storage)
  camConfig: CamConfig;

  @ManyToOne(() => Provider, (provider) => provider.storages)
  @JoinColumn({ name: 'idProvider' })
  provider: Provider;

  constructor(storage: Partial<Storage>) {
    Object.assign(
      this,
      plainToClass(Storage, storage, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
