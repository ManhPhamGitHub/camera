import { Noti } from '@entities';
import { Injectable } from '@nestjs/common';
import { NotiRepository } from '@repositories';

@Injectable()
export class NotiService {
  constructor(private storageRepository: NotiRepository) {}
  findOne(option) {
    return this.storageRepository.findOne(option);
  }
  findAll(option) {
    return this.storageRepository.findAll(option);
  }
  insert(data: Noti) {
    return this.storageRepository.insert(data);
  }
  update(id: number | string, updateData: any) {
    return this.storageRepository.update(id, updateData);
  }

  updateMulti(option: any, updateData: any) {
    return this.storageRepository.updateMulti(option, updateData);
  }
}
