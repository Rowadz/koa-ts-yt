import 'reflect-metadata'
import { Service } from 'typedi'
import { Repository, Connection } from 'typeorm'
import { UsersEntity } from '../entities/users.entity'
import { BaseService } from './base.service'

@Service()
export class UsersService extends BaseService<UsersEntity> {
  repo: Repository<UsersEntity>
  constructor(db: Connection) {
    super()
    this.repo = db.getRepository(UsersEntity)
  }
}
