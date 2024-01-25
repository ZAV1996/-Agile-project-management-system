import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity'
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateAuthDto } from "../auth/dto/create-auth.dto"
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({ select: ['ID', 'CODE_SUBDIV', 'EMAIL', 'FIRST_NAME', 'LAST_NAME', 'LOGIN', 'MIDDLE_NAME', 'PER_NUM', 'POS_NAME', 'TYPE_SUBDIV_NAME'] });
  }
  async getUserByID(ID: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ ID });
  }

  async getUserByEmail(EMAIL: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ EMAIL });
  }

  async getUserByPER_NUM(PER_NUM: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ PER_NUM });
  }

  async createUser(credintals: CreateAuthDto, uuid: string) {
    let user: User = new User();
    user.EMAIL = credintals.email;
    user.LOGIN = credintals.login;
    user.PER_NUM = credintals.per_num
    user.PASSWORD = credintals.password
    user.FIRST_NAME = credintals.FIRST_NAME
    user.MIDDLE_NAME = credintals.MIDDLE_NAME
    user.LAST_NAME = credintals.MIDDLE_NAME
    user.isActivated = false
    user.activationToken = uuid
    this.userRepository.save(user)
    return user;
  }

  async activateUser(user: User) {
    this.userRepository.save({
      ...user, isActivated: true, activationToken: null
    })
  }


  async updateUser(user: User) {
    this.userRepository.save({ ...user })
  }
}
