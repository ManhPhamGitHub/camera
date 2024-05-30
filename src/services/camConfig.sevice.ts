import { CamConfig } from '@entities';
import { Injectable } from '@nestjs/common';
import { CamConfigRepository } from '@repositories';

@Injectable()
export class CamConfigService {
  constructor(private camConfigRepository: CamConfigRepository) {}
  findOne(option) {
    return this.camConfigRepository.findOne(option);
  }
  findAll(option) {
    return this.camConfigRepository.findAll(option);
  }
  insert(data: CamConfig) {
    return this.camConfigRepository.insert(data);
  }
  update(id: number | string, updateData: any) {
    return this.camConfigRepository.update(id, updateData);
  }

  updateMulti(option: any, updateData: any) {
    return this.camConfigRepository.updateMulti(option, updateData);
  }
}
