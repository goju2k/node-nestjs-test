import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import BaseController from 'src/nest/dev/base/base.controller';
import { VersionServiceDto } from '../services/dto/versionservice.dto';
import { VersionService } from '../services/version.service';
import { MyBody, MyBody2 } from './dto/version.dto'

import {executionAsyncId, triggerAsyncId} from 'async_hooks'
import LogUtil from 'src/common/util/log';
import WwwMbrPublicService from 'src/apis/rfind/services/WwwMbrPublicService';

@ApiTags('VersionController')
@Controller('/core/version')
export class VersionController extends BaseController {
  
  constructor(private readonly versionService: VersionService, private readonly wwwMbrPublicService: WwwMbrPublicService) {super()}

  @Get()
  @ApiOperation({operationId:'getCoreVersion'})
  async getCoreVersion(): Promise<string> {

    LogUtil.log('code ㅇㅇㅇㅇㅇㅇ경!!!!')
    const a = await this.wwwMbrPublicService.postWwwQus({qusCtn:'', qusInflRoutCd:'', qusTypeCd:''})
    LogUtil.log('getCoreVersion wwwMbrPublicService.postWwwQus => ', a)

    LogUtil.log('VersionController.getCoreVersion => '+executionAsyncId(), triggerAsyncId())
    return await this.versionService.getVersion(new VersionServiceDto());
  }

  @Get(':id')
  async getExecId(@Param('id') id:string): Promise<string> {
    
    return this.res(id)
  }

  @Post()
  postExec(@Body() body: MyBody2 ): MyBody {
    return new MyBody();
  }

}
