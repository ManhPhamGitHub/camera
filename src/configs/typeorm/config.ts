import { env } from '@environments';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.get('mysql.host'),
  port: env.get('mysql.port'),
  username: env.get('mysql.username'),
  password: env.get('mysql.password'),
  database: env.get('mysql.database'),
  entities: ['src/**/entities/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['src/**/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

export default AppDataSource;
