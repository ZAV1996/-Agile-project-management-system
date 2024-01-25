import { Global, MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTSession } from "./entities/JWTSession.entity";
import { SmtpSendlerModule } from 'src/smtp-sendler/smtp-sendler.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({}),
    TypeOrmModule.forFeature([JWTSession]),
    SmtpSendlerModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .forRoutes('api')
  }
}
