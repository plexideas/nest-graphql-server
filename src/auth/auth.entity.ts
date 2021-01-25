import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType('Auth')
@Entity({ name: 'auth' })
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Field()
  @Column({ type: 'varchar' })
  public refreshToken: string;

  @Field()
  @Column({ type: 'bigint' })
  public refreshTokenExpiresAt: number;

  @Field()
  public accessToken: string;

  @Field()
  @Column({ type: 'bigint' })
  public accessTokenExpiresAt: number;

  @Field()
  @JoinColumn()
  @OneToOne(() => UserEntity)
  public user: UserEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
