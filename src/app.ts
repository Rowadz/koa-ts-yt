import * as Koa from 'koa'
import { DefaultState, DefaultContext } from 'koa'
import { createKoaServer, useContainer } from 'routing-controllers'
import { connectWithDB } from './entities'
import { UsersController } from './Controllers'
import { Container } from 'typedi'
import { services } from './services'
import 'colors'
const port = 3000

const startApp = async () => {
  const app: Koa<DefaultState, DefaultContext> = createKoaServer({
    controllers: [UsersController],
  })
  await connectWithDB(app)
  services.forEach((service) => {
    Container.set(service, new service(app.context.db))
  })
  useContainer(Container)

  app
    .listen(port)
    .on('listening', () =>
      console.log(
        `sever started on port=${port} go to http://localhost:${port}`.blue.bold
      )
    )
}

startApp()
