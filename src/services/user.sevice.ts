import { User } from '@entities';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@repositories';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  findOne(option) {
    return this.userRepository.findOne(option);
  }
  findAll(option) {
    return this.userRepository.findAll(option);
  }
  insert(user: User) {
    return this.userRepository.insert(user);
  }
  update(id: number | string, updateData: any) {
    return this.userRepository.update(id, updateData);
  }

  updateMulti(option: any, updateData: any) {
    return this.userRepository.updateMulti(option, updateData);
  }
}
