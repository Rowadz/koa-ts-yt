import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  Ctx,
  JsonController,
} from 'routing-controllers'
import { CTX } from '../interfaces'
import { UsersService } from '../services'
import { UsersEntity } from '../entities/users.entity'
import { genSalt, hash } from 'bcrypt'
import { validate, ValidationError } from 'class-validator'
import { DeepPartial } from 'typeorm'
import { CREATE, UPDATE } from '../entities/customValidators'

@JsonController('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(@Ctx() ctx: CTX) {
    // ctx.db.getRepository(UsersEntity).find()
    return this.usersService.getData()
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.usersService.getById(id)
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
  remove(@Param('id') id: number) {
    return this.usersService.del(id)
  }
}
