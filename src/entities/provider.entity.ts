import { Expose, plainToClass } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CamConfig } from './camConfig.entity';
@Entity({ name: 'provider' })
export class Provider {
  @Column({ type: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column({ default: true })
  @Expose()
  providerName: string;

  @Column({ type: 'text' })
  @Expose()
  identify: any;

  @Column({ type: 'json', nullable: true })
  @Expose()
  config: any;

  @Column({ nullable: true })
  @Expose()
  fileDirection: string;

  @Column()
  @Expose()
  idCamConfig: string;

  @OneToOne(() => CamConfig, (cc) => cc.provider)
  @JoinColumn({ name: 'idCamConfig', referencedColumnName: 'id' })
  camConfig: CamConfig;

  constructor(provider: Partial<Provider>) {
    Object.assign(
      this,
      plainToClass(Provider, provider, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
