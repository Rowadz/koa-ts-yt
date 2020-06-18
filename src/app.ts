import * as Koa from 'koa'
import { DefaultState, DefaultContext, ParameterizedContext } from 'koa'
import * as Router from 'koa-router'
import { connectWithDB } from './entities'
import 'colors'
const port = 3000

const startApp = async () => {
  const app: Koa<DefaultState, DefaultContext> = new Koa()
  const router: Router = new Router()
  await connectWithDB(app)

  router.get(
    '/',
    async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
      ctx.body = { msg: 'hello world' }
    }
  )

  app.use(router.routes()).use(router.allowedMethods())

  app
    .listen(port)
    .on('listening', () =>
      console.log(
        `sever started on port=${port} go to http://localhost:${port}`.blue.bold
      )
    )
}

startApp()
