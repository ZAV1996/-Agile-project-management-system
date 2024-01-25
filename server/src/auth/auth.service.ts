import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { DeleteAuthDto } from "./dto/delete-auth.dto"
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import { env } from 'process';
import { CreateTokenData, Email, Tokens } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { JWTSession } from "./entities/JWTSession.entity";
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SmtpSendlerService } from 'src/smtp-sendler/smtp-sendler.service';
import { Token } from 'nodemailer/lib/xoauth2';
type UserNonPass = Omit<User, "PASSWORD">;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(JWTSession) private RTokensRepository: Repository<JWTSession>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private smpt: SmtpSendlerService
  ) { }



  async getTokens(EMAIL: string, PER_NUM: string, uuid: string, USER_AGENT: string, IP: string): Promise<Tokens> {

    const [AT, RT] = await Promise.all([
      this.jwtService.signAsync(
        { EMAIL, PER_NUM, UUID: uuid, USER_AGENT, IP },
        {
          expiresIn: "10m",
          secret: env.PRIVATE_KEY_ACCESS
        }
      ),
      this.jwtService.signAsync(
        { EMAIL, PER_NUM, UUID: uuid, USER_AGENT, IP },
        {
          expiresIn: "7d",
          secret: env.PRIVATE_KEY_REFRESH
        }
      ),
    ])
    return {
      access_token: AT,
      refresh_token: RT
    }
  }

  async saveTokens(PER_NUM: string, UUID: string, RToken: string, AToken: string) {
    //TODO - Доделать функцию чтобы она сохраняла и заменяла токен у пользователя по id токена
    const Tokens = new JWTSession()
    Tokens.REFRESH_TOKEN = RToken;
    Tokens.UUID = UUID;
    Tokens.PER_NUM = PER_NUM;
    Tokens.ACCESS_TOKEN = AToken;
    this.RTokensRepository.save(Tokens)
  }

  async registration(createAuthDto: CreateAuthDto): Promise<void> {
    const candidate = await this.usersService.getUserByEmail(createAuthDto.email);
    if (candidate) {
      throw new HttpException("Пользователь с таким email уже зарегистрирован.", HttpStatus.BAD_REQUEST)
    }
    const uuid = uuidv4();
    const hashPassword = await this.hashData(createAuthDto.password);
    const user = await this.usersService.createUser({ ...createAuthDto, password: hashPassword }, uuid);

    await this.smpt.sendUserConfirmation(user, uuid)
  }

  async login(userDto: CreateUserDto, UserAgent: string, IP: string): Promise<Tokens> {

    const user = await this.validate(userDto);
    const activeTokens = await this.RTokensRepository.findBy({ PER_NUM: user.PER_NUM });

    activeTokens.forEach(token => {
      const data: CreateTokenData = this.jwtService.decode(token.REFRESH_TOKEN);
      if (data.IP === IP && data.USER_AGENT === UserAgent) {
        throw new ForbiddenException({ message: "Вы уже авторизованы", status: 403 })
      }
    });
    const uuid = uuidv4();

    const tokens = await this.getTokens(user.EMAIL, user.PER_NUM, uuid, UserAgent, IP);
    await this.saveTokens(user.PER_NUM, uuid, tokens.refresh_token, tokens.access_token)

    return tokens
  }

  async refreshToken(refresh_token: string, UserAgent: string, IP: string) {
    const decodeToken: CreateTokenData = this.jwtService.decode(refresh_token)
    const uuid = uuidv4();
    const oldToken = await this.RTokensRepository.findOneBy({ UUID: decodeToken.UUID })
    if (!oldToken) {
      throw new ForbiddenException({ message: "Токен больше не действителен" })
    }
    this.RTokensRepository.manager.delete(JWTSession, { UUID: decodeToken.UUID })
    const tokens = await this.getTokens(decodeToken.EMAIL, decodeToken.PER_NUM, uuid, UserAgent, IP);
    this.saveTokens(decodeToken.PER_NUM, uuid, tokens.refresh_token, tokens.access_token)
    return tokens
  }

  async logout(access_token: string) {
    const decodeToken: CreateTokenData = this.jwtService.decode(access_token);
    try {
      this.RTokensRepository.manager.delete(JWTSession, { UUID: decodeToken.UUID })
      return new UnauthorizedException("Вы выши из системы")
    } catch {
      throw new ForbiddenException({ message: "Нет доступа" })
    }
  }

  async confirm(PER_NUM: string, token: string) {
    const user = await this.usersService.getUserByPER_NUM(PER_NUM);//
    if (user?.isActivated) {
      throw new ForbiddenException({ message: "Аккаунт уже активирован" })
    }
    if (user?.activationToken === token) {
      this.usersService.activateUser(user);
      return { message: "Учетная запись активированa" }
    }
    else {
      throw new ForbiddenException({ message: "Неверный токен активации" })
    }
  }

  async forgot(email: string) {
    const user = await this.usersService.getUserByEmail(email)
    const token = uuidv4();
    await this.smpt.sendForgotPassword(user, token)
  }

  private async validate(credintals: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(credintals.email);
    if (!user) {
      throw new UnauthorizedException({ message: "Пользователь с таким email не зарегистрирован." })
    }
    if (!user.isActivated) {
      throw new UnauthorizedException({ message: "Учетная запись не подтверджена" })
    }

    const passwordEquals = await bcrypt.compare(credintals.password, user.PASSWORD);
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: "Некорректный email или пароль" })
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10)
  }


}
