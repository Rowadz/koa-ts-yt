import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { SharedProp } from './sharedProp.entity'
import { PostsEntity } from './posts.entity'

export type UserType = 'admin' | 'user'

@Entity({ name: 'users' })
export class UsersEntity extends SharedProp {
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    salt: string,
    birthOfDate?: Date,
    type?: UserType
  ) {
    super()
    this.firstName = firstName
    this.lastName = lastName
    this.birthOfDate = birthOfDate
    this.email = email
    this.type = type
    this.password = password
    this.salt = salt
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'first_name', nullable: false })
  firstName: string

  @Column({ name: 'last_name', nullable: false })
  lastName: string

  @Column({ name: 'birth_of_date', nullable: true, type: 'date' })
  birthOfDate: Date

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ default: 'user' })
  type: UserType

  @Column({ nullable: false })
  password: string

  @Column({ nullable: false })
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
