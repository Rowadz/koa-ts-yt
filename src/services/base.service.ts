import { Repository, DeepPartial } from 'typeorm'

export class BaseService<T> {
  readonly repo: Repository<T>

  constructor(repo: Repository<T>) {
    this.repo = repo
  }

  async getDate(): Promise<Array<T>> {
    return await this.repo.find()
  }

  async getById(id: number): Promise<T> {
    return await this.repo.findOne(id)
  }

  async update(id: number, body: DeepPartial<T>) {
    return await this.repo.update(id, body)
  }

  async del(id: number): Promise<T> {
    await this.repo.delete(id)
    return await this.getById(id)
  }
}
