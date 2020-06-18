import * as Koa from 'koa'
import { DefaultState, DefaultContext } from 'koa'
import { createConnection, Connection } from 'typeorm'
import { config } from 'dotenv'
import 'colors'
config()
const { DB_HOST, DB_USER, DB_PASS } = process.env
console.log({ DB_HOST, DB_USER, DB_PASS })

export const connectWithDB = async (
  app: Koa<DefaultState, DefaultContext>
): Promise<void> => {
  const connection: Connection = await createConnection({
    type: 'sqlite',
    database: './koa.db',
  })
  await connection
    .synchronize(true) // pass true to drop everything and create them again
    .then(() => console.log('synchronized! with DB'.green.bold))
    .catch(() => console.error('Faild to sync with DB'.red.bold))
  app.context.db = connection
}
