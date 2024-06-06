import { Storage } from '@entities';
import { Injectable } from '@nestjs/common';
import { StorageRepository } from '@repositories';

@Injectable()
export class StorageService {
  constructor(private storageRepository: StorageRepository) {}
  findOne(option) {
    return this.storageRepository.findOne(option);
  }
  findAll(option) {
    return this.storageRepository.findAll(option);
  }
  insert(data: Storage) {
    return this.storageRepository.insert(data);
  }
  update(id: number | string, updateData: any) {
    return this.storageRepository.update(id, updateData);
  }

  updateMulti(option: any, updateData: any) {
    return this.storageRepository.updateMulti(option, updateData);
  }
}
