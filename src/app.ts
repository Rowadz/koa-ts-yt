import * as Koa from 'koa'
import { DefaultState, DefaultContext, ParameterizedContext } from 'koa'
import * as Router from 'koa-router'
import 'colors'
const port = 3000

const app: Koa<DefaultState, DefaultContext> = new Koa()
const router: Router = new Router()

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
