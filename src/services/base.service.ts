import { Repository } from 'typeorm'

export class BaseService<T> {
  repo: Repository<T>

  async getDate(): Promise<Array<T>> {
    return await this.repo.find()
  }

  async getById(id: number): Promise<T> {
    return await this.repo.findOne(id)
  }

  async update(id: number, body: Partial<T>) {}
}
