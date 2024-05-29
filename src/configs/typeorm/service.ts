import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { env } from '@environments';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: env.get('mysql.host'),
      port: env.get('mysql.port'),
      username: env.get('mysql.username'),
      password: env.get('mysql.password'),
      database: env.get('mysql.database'),
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
      synchronize: false,
      autoLoadEntities: true,
      keepConnectionAlive: true,
      logger: 'simple-console',
      logging: env.get('mysql.isLogging') ? 'all' : undefined,
    };
  }
}
