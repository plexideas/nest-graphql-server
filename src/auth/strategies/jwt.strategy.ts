import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  public async validate(payload: any): Promise<UserEntity> {
    const user = await this.userService.findOne({ email: payload.email });
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
