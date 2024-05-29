import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { ApiDocs, CurrentUser, ResponseInterceptor } from '@common';
import { UserService } from '@services';
import { ForbiddenException, ParamsException } from '@utils/exceptions';
import { UserStatusType } from '@dtos';
import { User } from '@entities';
@Controller('users')
@ApiDocs({ isBearerAuth: true, tag: 'users' })
@UseInterceptors(new ResponseInterceptor())
export class UserController {
  private readonly httpService;
  constructor(private userService: UserService) {}

  // @UseGuards(CheckAdmin)
  // @Get('/get-namespace-users')
  // async getNamespaceUsers(
  //   @CurrentUser() user: User,
  //   @Query() queryNamespaceUsersDto: QueryNamespaceUsersDto,
  // ) {
  //   return this.userService.getPaginateNamespaceUsers(
  //     user.namespace,
  //     queryNamespaceUsersDto,
  //     { packages: true },
  //   );
  // }

  @Put('/update-active')
  async updateActiveUser(
    @CurrentUser() user: User,
    @Body() updateActiveUserDto: any,
  ) {
    const { activeUserId } = updateActiveUserDto;
    const userChange = await this.userService.findOne({
      where: {
        id: activeUserId,
      },
    });
    if (!userChange)
      throw new ParamsException(`Not found user ${activeUserId}`);
    if (userChange.id == user.id) {
      throw new ForbiddenException('You can not change yourself');
    }
    if (userChange.namespace != user.namespace) {
      throw new ForbiddenException(
        `user ${activeUserId} is not in your namespace`,
      );
    }
    await this.userService.update(activeUserId, {
      status: UserStatusType.ACTIVE,
    });
    return {
      status: true,
    };
  }
}
