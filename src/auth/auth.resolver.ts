import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/decorators/public';
import { UserInput } from 'src/user/user.input';
import { UserService } from 'src/user/user.service';
import { AuthEntity } from './auth.entity';
import { AuthService } from './auth.service';

@Resolver(() => AuthEntity)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Mutation(() => AuthEntity)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthEntity> {
    return this.authService.login({ email, password });
  }

  @Public()
  @Mutation(() => AuthEntity)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthEntity> {
    return this.authService.refresh({ refreshToken });
  }

  @Mutation(() => Boolean)
  async logout(@Args('refreshToken') refreshToken: string): Promise<boolean> {
    await this.authService.delete({ refreshToken });
    return true;
  }

  @Public()
  @Mutation(() => AuthEntity)
  async signup(@Args('input') input: UserInput): Promise<AuthEntity> {
    const user = await this.userService.create(input);
    return this.authService.loginUser(user);
  }
}
