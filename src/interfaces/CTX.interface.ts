import { Context } from 'koa'
import { Connection } from 'typeorm'

export interface CTX extends Context {
  db: Connection
}
