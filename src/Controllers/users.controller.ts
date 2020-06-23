import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Delete,
  Patch,
} from 'routing-controllers'

@Controller('/users')
export class UsersController {
  @Get()
  getAll() {
    return 'This action returns all users'
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
