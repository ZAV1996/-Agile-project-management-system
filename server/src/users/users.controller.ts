import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ATGuard } from 'src/commons/guards';
import { AGuard } from 'src/commons/guards/access.guard';
@ApiTags("Пользователи")
@Controller('api/')
export class UsersController {
  constructor(private readonly appService: UsersService) { }



  @ApiOperation({
    summary: "Получить всех пользователей"
  })
  @ApiResponse({ status: "2XX", type: [User], description: "Запрос успешно выполнен" })
  @UseGuards(AGuard)
  @Get('/users')
  getAllUsers(): Promise<User[]> {
    return this.appService.getAllUsers();
  }

  @UseGuards(ATGuard)
  @Get('/user/id=:id')
  getUserByID(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.appService.getUserByID(id)
  }

  @Get('/user/per_num=:PER_NUM')
  getUserByPER_NUM(@Param('PER_NUM') PER_NUM: string): Promise<User | null> {
    return this.appService.getUserByPER_NUM(PER_NUM)
  }
}
