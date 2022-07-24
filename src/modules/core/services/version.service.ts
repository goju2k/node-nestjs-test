import { Injectable } from '@nestjs/common';
import { VersionServiceDto } from './dto/versionservice.dto';

import {executionAsyncId} from 'async_hooks'
import BaseService from 'src/nest/dev/base/base.service';
import { getHeader } from 'src/common/header/header';
import LogUtil from 'src/common/util/log';
import WwwMbrPrdService from 'src/apis/rfind/services/WwwMbrPrdService';

const as1 = async () => {
  as2()
}

const as2 = () => {
  LogUtil.log('VersionService.getVersion => ', getHeader().token)
}

@Injectable()
export class VersionService extends BaseService {

  constructor(private readonly wwwMbrPrdService: WwwMbrPrdService){
    super()
  }

  async getVersion(dto:VersionServiceDto): Promise<string> {

    const a = await this.wwwMbrPrdService.getPrdBasicInfo('PRD00131993')
    LogUtil.log('getVersion wwwMbrPrdService.getPrdBasicInfo => ', a)

    LogUtil.log('VersionService.getVersion => ', executionAsyncId(), getHeader().token)
    as1()
    return this.res(require('../../../../package.json').version)
  }
}
