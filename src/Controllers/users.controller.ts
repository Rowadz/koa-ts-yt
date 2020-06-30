import {
  Param,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  Ctx,
  JsonController,
  UnauthorizedError,
  Authorized,
  CurrentUser,
} from 'routing-controllers'
import { CTX } from '../interfaces'
import { UsersService } from '../services'
import { UsersEntity } from '../entities/users.entity'
import { genSalt, hash } from 'bcrypt'
import { validate, ValidationError } from 'class-validator'
import { DeepPartial } from 'typeorm'
import { CREATE, UPDATE } from '../entities/customValidators'
import { LoginRules } from './requestValidation'
import { sign } from 'jsonwebtoken'
import { config } from 'dotenv'
config()
const { JWT_SECRET } = process.env

@JsonController('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(@Ctx() ctx: CTX) {
    // ctx.db.getRepository(UsersEntity).find()
    return this.usersService.getData()
  }

  @Get('/:id')
  @Authorized()
  getOne(
    @Param('id') id: number,
    @CurrentUser() user: DeepPartial<UsersEntity>
  ): Promise<UsersEntity> {
    console.log(user)
    return this.usersService.getById(id)
  }

  @Post('/login')
  async login(@Body() userCred: LoginRules): Promise<UsersEntity> {
    const validationRes: Array<ValidationError> = await validate(userCred)
    if (validationRes.length > 0) throw validationRes
    const { email, password } = userCred
    try {
      const user: Exclude<
        UsersEntity,
        { accessToken: string }
      > = await this.usersService.getById(null, { email })
      const hashedPass = await hash(password, user.salt)
      if (hashedPass === user.password) {
        delete user.password
        delete user.salt
        const jwt = sign(JSON.parse(JSON.stringify(user)), JWT_SECRET)
        return { ...user, accessToken: jwt }
      }
    } catch {
      throw new UnauthorizedError('user not found')
    }
  }

  @Post()
  async post(@Body() user: DeepPartial<UsersEntity>) {
    const instance: DeepPartial<UsersEntity> = this.usersService.getInstance(
      user
    )
    const validationRes: Array<ValidationError> = await validate(instance, {
      groups: [CREATE],
    })
    if (validationRes.length > 0) throw validationRes
    instance.salt = await genSalt()
    instance.password = await hash(user.password, instance.salt)
    return this.usersService.create(user, instance)
  }

  @Patch('/:id')
  @Authorized()
  async patch(@Param('id') id: number, @Body() user: Partial<UsersEntity>) {
    const instance: DeepPartial<UsersEntity> = this.usersService.getInstance(
      user
    )
    const validationRes: Array<ValidationError> = await validate(instance, {
      groups: [UPDATE],
    })
    if (validationRes.length > 0) throw validationRes
    return this.usersService.update(id, user)
  }

  @Delete('/:id')
  @Authorized()
  remove(@Param('id') id: number) {
    return this.usersService.del(id)
  }
}
