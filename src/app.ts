import * as Koa from 'koa'
import { DefaultState, DefaultContext } from 'koa'
import {
  UnauthorizedError,
  createKoaServer,
  useContainer,
  Action,
} from 'routing-controllers'
import { connectWithDB } from './entities'
import { UsersController } from './Controllers'
import { Container } from 'typedi'
import { services } from './services'
import { config } from 'dotenv'
import { getConnection, DeepPartial } from 'typeorm'
import { decode, verify } from 'jsonwebtoken'
import 'colors'
import { UsersEntity } from './entities/users.entity'
const port = 3000
config()
const { JWT_SECRET } = process.env

const startApp = async () => {
  const getJWT = ({ authorization }: any) => {
    const [, token]: string = authorization.split(' ')
    return token
  }
  const decodeJWT = (token: string): DeepPartial<UsersEntity> =>
    decode(token) as DeepPartial<UsersEntity>

  const app: Koa<DefaultState, DefaultContext> = createKoaServer({
    // development: false, to remove stack
    controllers: [UsersController],
    async authorizationChecker(action: Action) {
      try {
        const token = getJWT(action.request.headers)
        if (!verify(token, JWT_SECRET)) throw new UnauthorizedError()
        const decodedUser: DeepPartial<UsersEntity> = decodeJWT(token)
        await getConnection().getRepository(UsersEntity).findOne(decodedUser.id)
        return true
      } catch {
        throw new UnauthorizedError()
      }
    },
    async currentUserChecker(action: Action) {
      try {
        const token = getJWT(action.request.headers)
        const decodedUser: DeepPartial<UsersEntity> = decodeJWT(token)
        return await getConnection()
          .getRepository(UsersEntity)
          .findOne(decodedUser.id)
      } catch {
        throw new UnauthorizedError()
      }
    },
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
