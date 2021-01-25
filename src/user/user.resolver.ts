import { Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/common/decorators/roles';
import { User } from 'src/common/decorators/user';
import { UserEntity, UserRole } from './user.entity';
import { UserService } from './user.service';

@Resolver('Users')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Roles(UserRole.Admin)
  @Query(() => [UserEntity])
  async users(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Query(() => UserEntity)
  async user(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
