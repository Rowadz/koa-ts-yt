import 'reflect-metadata'
import { Service } from 'typedi'
import { Connection } from 'typeorm'
import { UsersEntity } from '../entities/users.entity'
import { BaseService } from './base.service'

@Service()
export class UsersService extends BaseService<UsersEntity> {
  constructor(db: Connection) {
    super(db.getRepository(UsersEntity))
  }
}
