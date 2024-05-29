import { Expose, plainToClass } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

  constructor(provider: Partial<Provider>) {
    Object.assign(
      this,
      plainToClass(Provider, provider, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
