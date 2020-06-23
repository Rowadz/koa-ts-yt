import * as Koa from 'koa'
import { DefaultState, DefaultContext, ParameterizedContext } from 'koa'
import { createKoaServer } from 'routing-controllers'
import { connectWithDB } from './entities'
import { UsersController } from './Controllers'
import 'colors'
const port = 3000

const startApp = async () => {
  const app: Koa<DefaultState, DefaultContext> = createKoaServer({
    controllers: [UsersController],
  })
  await connectWithDB(app)

  app
    .listen(port)
    .on('listening', () =>
      console.log(
        `sever started on port=${port} go to http://localhost:${port}`.blue.bold
      )
    )
}

startApp()
