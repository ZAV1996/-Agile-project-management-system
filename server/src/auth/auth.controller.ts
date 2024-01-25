import { Controller, ExecutionContext, Req, Post, Body, Patch, Param, Delete, UnauthorizedException, UsePipes, ValidationPipe, UseGuards, HttpCode, HttpStatus, Get, Query, Ip, Res, Next, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateTokenData, Email, Tokens, UpdatePass } from './types';
import { ATGuard, RTGuard } from 'src/commons/guards';
import { GetCurrentUser } from 'src/commons/decorators';
import { Request, Response } from 'express';
import { env } from 'process';
import { RGuard } from 'src/commons/guards/refresh.guard';
import { AGuard } from 'src/commons/guards/access.guard';
@ApiTags("Авторизация")
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  registration(@Body() createAuthDto: CreateAuthDto): Promise<void> {
    return this.authService.registration(createAuthDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() createUserDto: CreateUserDto, @Req() req: Request, @Ip() ip: string, @Res({ passthrough: true }) response: Response) {
    const user_agent = Object(req.headers)['user-agent']
    const tokens = await this.authService.login(createUserDto, user_agent, ip);
    response.cookie("access", tokens.access_token,
      {
        httpOnly: true,
        path: "/",
        maxAge: 1000 * 60 * 15,
        secure: true,
        sameSite: "strict"
      }
    );
    response.cookie("refresh", tokens.refresh_token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      sameSite: "strict"
    });
  }

  @Delete('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const access_token = req.cookies.access;
    const resp = (await this.authService.logout(access_token));
    if (resp.getStatus() === 401) {
      response.clearCookie("access");
      response.clearCookie("refresh");
    }
    return resp
  }

  @Post('/refresh')
  @UseGuards(RGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Ip() ip: string, @Res({ passthrough: true }) response: Response) {
    const user_agent = Object(req.headers)['user-agent'];
    const refresh_token = req.cookies.refresh;
    const tokens = await this.authService.refreshToken(refresh_token, user_agent, ip)
    response.cookie("access", tokens.access_token,
      {
        httpOnly: true,
        path: "/",
        // maxAge: 1000 * 60 * 15,
        secure: true,
        sameSite: "strict"
      }
    );
    response.cookie("refresh", tokens.refresh_token, {
      httpOnly: true,
      path: "/",
      // maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      sameSite: "strict"
    });
  }

  @Get('/confirm')
  @HttpCode(HttpStatus.OK)
  confirm(@Query("PER_NUM") PER_NUM: string, @Query("token") token: string) {
    return this.authService.confirm(PER_NUM, token)
  }

  @Post('/forgot')
  @HttpCode(HttpStatus.OK)
  forgot(@Body() email: Email): void {
    this.authService.forgot(email.EMAIL)
  }
  @Post('/update-pass')
  @HttpCode(HttpStatus.OK)
  forgotpass(@Body() body: UpdatePass): void /*  */ {
    this.authService.updatePass(body);
  }


}




