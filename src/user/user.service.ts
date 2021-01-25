import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { FindConditions, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserInput } from './user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  public findOne(where: FindConditions<UserEntity>): Promise<UserEntity> {
    return this.userEntityRepository.findOne({ where });
  }

  public findAll(): Promise<UserEntity[]> {
    return this.userEntityRepository.find();
  }

  public getByCredentials({ email, password }: UserInput): Promise<UserEntity> {
    return this.userEntityRepository.findOne({
      where: {
        email,
        password: this.createPasswordHash(password, email),
      },
    });
  }

  public async create(input: UserInput): Promise<UserEntity> {
    const { email, password } = input;

    let user = await this.userEntityRepository.findOne({
      where: { email },
    });

    if (user) {
      throw Error('User already exists');
    }

    user = await this.userEntityRepository
      .create({
        ...input,
        password: this.createPasswordHash(password, email),
      })
      .save();

    delete user.password;

    return user;
  }

  private createPasswordHash(password: string, salt: string) {
    return createHash('sha256').update(password).update(salt).digest('hex');
  }
}
