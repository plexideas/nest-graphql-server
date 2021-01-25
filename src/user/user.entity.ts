import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@Entity({ name: 'users' })
@ObjectType('User')
export class UserEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: string;

  @Field(() => String)
  @Column({ type: 'varchar', nullable: true })
  public name: string;

  @Field(() => String)
  @Column({ type: 'varchar' })
  public email: string;

  @Column({ type: 'varchar', select: false })
  public password: string;

  @Field(() => [UserRole])
  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.User],
  })
  public role: string;

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;
}
