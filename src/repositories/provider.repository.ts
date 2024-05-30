import { Provider } from '@entities';
import { DataSource, ILike, Between } from 'typeorm';
import { AbstractMysqlRepository } from './base.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderRepository extends AbstractMysqlRepository<Provider> {
  constructor(private dataSource: DataSource) {
    super(dataSource.getRepository(Provider));
  }
  mapOptionsQuery(
    namespace: string,
    data: any,
    relations: Record<string, boolean>,
  ) {
    const {
      page = 1,
      size = 50,
      id,
      orderBy = { createdAt: 'DESC' },
      ...query
    } = data;

    const options = {
      pagination: { page: page, size: size },
      where: {},
      order: orderBy,
      relations: {},
    };

    const whereQuery: any = {};
    whereQuery.namespace = namespace;
    if (id) {
      whereQuery.id = id;
    }

    if (relations) {
      options.relations = relations;
    }
    options.where = { ...whereQuery };
    return options;
  }
}
