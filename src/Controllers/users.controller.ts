import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  Ctx,
} from 'routing-controllers'
import { CTX } from '../interfaces'
import { UsersService } from '../services'
import { UsersEntity } from '../entities/users.entity'
import { genSalt, hash } from 'bcrypt'

@Controller('/users')
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
  async post(@Body() user: Partial<UsersEntity>) {
    user.salt = await genSalt()
    user.password = await hash(user.password, user.salt)
    return this.usersService.create(user)
  }

  @Patch('/:id')
  patch(@Param('id') id: number, @Body() user: Partial<UsersEntity>) {
    return this.usersService.update(id, user)
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.usersService.del(id)
  }
}
