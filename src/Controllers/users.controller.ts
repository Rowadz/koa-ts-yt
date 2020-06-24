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
import { UsersEntity } from '../entities/users.entity'
import { UsersService } from '../services'

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log(usersService)
  }

  @Get()
  getAll(@Ctx() ctx: CTX) {
    return ctx.db.getRepository(UsersEntity).find()
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return `This action returns user ${id}`
  }

  @Post()
  post(@Body() user: any) {
    return {
      saved: true,
      user,
    }
  }

  @Patch('/:id')
  put(@Param('id') id: number, @Body() user: any) {
    return {
      update: true,
      user,
      id,
    }
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return `Removing user... ${id}`
  }
}
