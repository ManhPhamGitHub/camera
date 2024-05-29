import { env } from '@environments';

const seedConfig = {
  type: 'postgres',
  host: env.get('postgres.host'),
  port: env.get('postgres.port'),
  username: env.get('postgres.username'),
  password: env.get('postgres.password'),
  database: env.get('postgres.database'),
  entities: ['src/**/entities/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['src/**/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  seeds: ['src/**/seeds/**/*{.ts,.js}'],
};

export default seedConfig;
