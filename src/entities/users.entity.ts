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
} from 'class-validator'
import { IsDateStringCustom, IsUniqueCustom } from './customValidators'
import { UsersService } from '../services'

export type UserType = 'admin' | 'user'

@Entity({ name: 'users' })
export class UsersEntity extends SharedProp {
  @PrimaryGeneratedColumn()
  @IsEmpty({ always: true, message: 'Do not send the ID!' })
  id: number

  @Column({ name: 'first_name', nullable: false })
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  firstName: string

  @Column({ name: 'last_name', nullable: false })
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  lastName: string

  @Column({ name: 'birth_of_date', nullable: true, type: 'date' })
  @IsDateStringCustom()
  birthOfDate: Date

  @Column({ unique: true, nullable: false })
  @IsEmail()
  @IsDefined()
  @IsUniqueCustom(UsersService)
  email: string

  @Column({ default: 'user' })
  @IsEmpty({ always: true, message: 'Do not send the user type!' })
  type: UserType

  @Column({ nullable: false })
  @Exclude()
  @IsString()
  @IsDefined()
  @MinLength(6)
  @MaxLength(25)
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
