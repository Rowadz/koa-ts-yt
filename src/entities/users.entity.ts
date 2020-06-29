import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { SharedProp } from './sharedProp.entity'
import { PostsEntity } from './posts.entity'
import { Exclude } from 'class-transformer'
import {
  IsDefined,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator'
import {
  IsDateStringCustom,
  IsUniqueCustom,
  CREATE,
  UPDATE,
} from './customValidators'
import { UsersService } from '../services'

export type UserType = 'admin' | 'user'

@Entity({ name: 'users' })
export class UsersEntity extends SharedProp {
  @PrimaryGeneratedColumn()
  @IsEmpty({ always: true, message: 'Do not send the ID!' })
  id: number

  @Column({ name: 'first_name', nullable: false })
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @MinLength(1, { always: true })
  @MaxLength(255, { always: true })
  firstName: string

  @Column({ name: 'last_name', nullable: false })
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @MinLength(1, { always: true })
  @MaxLength(255, { always: true })
  lastName: string

  @Column({ name: 'birth_of_date', nullable: true, type: 'date' })
  @IsDateStringCustom({ always: true })
  birthOfDate: Date

  @Column({ unique: true, nullable: false })
  @IsEmail({}, { always: true })
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsUniqueCustom(UsersService, { always: true })
  email: string

  @Column({ default: 'user' })
  @IsEmpty({ always: true, message: 'Do not send the user type!' })
  type: UserType

  @Column({ nullable: false })
  @Exclude()
  @IsString({ always: true })
  @IsDefined({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @MinLength(6, { always: true })
  @MaxLength(25, { always: true })
  password: string

  @Column({ nullable: false })
  @Exclude()
  @IsEmpty({ always: true, message: 'Do not the salt' })
  salt: string

  @OneToMany(() => PostsEntity, (post: PostsEntity) => post.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: Array<PostsEntity>

  accessToken?: string
}

/**
 * for the `type` use enum like this in mysql or postgres
 * enum UserType {
 *      user = 'user',
 *      admin = 'admin
 * }
 * @Column({ default: UserType.user, enum: UserType, type: 'enum' })
 * type: UserType;
 *
 */
