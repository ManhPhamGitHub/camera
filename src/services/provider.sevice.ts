import { Provider } from '@entities';
import { Injectable } from '@nestjs/common';
import { ProviderRepository } from '@repositories';

@Injectable()
export class ProviderService {
  constructor(private providerRepository: ProviderRepository) {}
  findOne(option) {
    return this.providerRepository.findOne(option);
  }
  findAll(option) {
    return this.providerRepository.findAll(option);
  }
  insert(data: Provider) {
    return this.providerRepository.insert(data);
  }
  update(id: number | string, updateData: any) {
    return this.providerRepository.update(id, updateData);
  }

  updateMulti(option: any, updateData: any) {
    return this.providerRepository.updateMulti(option, updateData);
  }
}
