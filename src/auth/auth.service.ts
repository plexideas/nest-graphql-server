import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { UserEntity } from 'src/user/user.entity';
import { UserInput } from 'src/user/user.input';
import { UserService } from 'src/user/user.service';
import { DeleteResult, FindConditions, Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authEntityRepository: Repository<AuthEntity>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async login(input: UserInput) {
    const user = await this.userService.getByCredentials(input);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.loginUser(user);
  }

  public async delete(
    where: FindConditions<AuthEntity>,
  ): Promise<DeleteResult> {
    return this.authEntityRepository.delete(where);
  }

  public async refresh(where: FindConditions<AuthEntity>): Promise<AuthEntity> {
    const auth = await this.authEntityRepository.findOne({
      where,
      relations: ['user'],
    });

    if (!auth || auth.refreshTokenExpiresAt < new Date().getTime()) {
      throw new UnauthorizedException();
    }

    return this.loginUser(auth.user);
  }

  public async loginUser(user: UserEntity): Promise<AuthEntity> {
    const refreshToken = v4();
    const date = new Date();
    const accessTokenExpiresAt = date.getTime() + ACCESS_TOKEN_EXPIRES_IN;
    const refreshTokenExpiresAt = date.getTime() + REFRESH_TOKEN_EXPIRES_IN;
    const isAuth = await this.authEntityRepository.findOne({
      where: { user: user },
      relations: ['user'],
    });

    if (isAuth) {
      await this.delete({ refreshToken: isAuth.refreshToken });
    }

    const auth = await this.authEntityRepository
      .create({
        user,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      })
      .save();

    auth.accessToken = this.jwtService.sign(
      { email: user.email },
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN / 1000 },
    );

    return auth;
  }
}
