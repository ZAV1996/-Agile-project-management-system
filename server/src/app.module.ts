import 'dotenv/config'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JWTSession } from './auth/entities/JWTSession.entity';
import { SmtpSendlerModule } from './smtp-sendler/smtp-sendler.module';
const HOST = process.env.HOST
const PORT = Number(process.env.PORT)
const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD
const DB = process.env.DB
const TYPE = process.env.TYPE

@Module({
  imports: [
    ConfigModule.forRoot(
      { envFilePath: '.env' }
    ),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: HOST,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
      database: DB,
      entities: [User, JWTSession],
      synchronize: true, //В проде надо отключить чтобы ненароком не потерять данные
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SmtpSendlerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
