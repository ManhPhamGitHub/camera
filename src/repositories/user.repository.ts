import { User } from '@entities';
import { DataSource, ILike, Between } from 'typeorm';
import { AbstractMysqlRepository } from './base.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends AbstractMysqlRepository<User> {
  constructor(private dataSource: DataSource) {
    super(dataSource.getRepository(User));
  }
  mapOptionsQuery(
    namespace: string,
    queryNamespaceUsersDto: any,
    relations: Record<string, boolean>,
  ) {
    const {
      page = 1,
      size = 50,
      id,
      orderBy = { createdAt: 'DESC' },
      email,
      firstName,
      lastName,
      phoneNumber,
      role,
      status,
      fromDate,
      toDate,
      username,
    } = queryNamespaceUsersDto;

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

    if (email) {
      whereQuery.email = ILike(`%${email}%`);
    }
    if (firstName) {
      whereQuery.firstName = firstName;
    }
    if (lastName) {
      whereQuery.lastName = lastName;
    }
    if (phoneNumber) {
      whereQuery.phoneNumber = phoneNumber;
    }
    if (role) {
      whereQuery.role = role;
    }
    if (status) {
      whereQuery.status = status;
    }
    if (username) {
      whereQuery.username = ILike(`%${username}%`);
    }
    if (fromDate && toDate) {
      whereQuery.createdAt = Between(fromDate, toDate);
    }

    if (relations) {
      options.relations = relations;
    }
    options.where = { ...whereQuery };
    return options;
  }
}
