import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @MinLength(6)
  readonly password: string;
}
