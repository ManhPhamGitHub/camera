import { Expose, plainToClass } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleType, UserStatusType } from '@dtos';

@Entity({ name: 'user' })
export class User {
  @Column({ type: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @Column()
  @Expose()
  phoneNumber: string;

  @Column()
  @Expose()
  email: string;

  @Column()
  @Expose()
  portalCode: string;

  @Column({ nullable: true })
  @Expose()
  username: string;

  @Column()
  @Expose()
  ownerUserId: string; //id cua keycloak

  @Column({ type: 'number' })
  @Expose()
  roleId: number;

  @Column({ nullable: true })
  @Expose()
  parentUser: string;

  @Column({
    type: 'enum',
    enum: UserStatusType,
    default: UserStatusType.PENDING,
  })
  @Expose()
  status: string;

  @Column()
  @Expose()
  namespace: string; // code of partner when register by keycloak

  @Column({ type: 'timestamp', nullable: true })
  firstActivedAt: Date;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  // @ManyToOne(() => RoleEntity, (msg) => msg.roleId)
  // @JoinColumn({
  //   name: 'roleId',
  //   referencedColumnName: 'roleId',
  // })
  // role: RoleEntity;

  // @ManyToMany(() => PackagesEntity, (p) => p.users, { cascade: true })
  // @JoinTable({
  //   name: 'user_packages',
  //   joinColumn: {
  //     name: 'userId',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'packageId',
  //     referencedColumnName: 'id',
  //   },
  // })
  // packages: PackagesEntity[];

  constructor(user: Partial<User>) {
    Object.assign(
      this,
      plainToClass(User, user, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
