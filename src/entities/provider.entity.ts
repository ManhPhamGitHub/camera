import { Expose, plainToClass } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Storage } from './storage.entity';
@Entity({ name: 'provider' })
export class Provider {
  @Column({ type: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column({ type: 'json' })
  @Expose()
  identify: any;

  @Column()
  @Expose()
  fileDirection: string;

  @OneToMany(() => Storage, (storage) => storage.provider)
  storages: Storage[];

  constructor(provider: Partial<Provider>) {
    Object.assign(
      this,
      plainToClass(Provider, provider, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
