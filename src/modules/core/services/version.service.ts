import { Injectable } from '@nestjs/common';
import { VersionServiceDto } from './dto/versionservice.dto';

import {executionAsyncId} from 'async_hooks'
import BaseService from 'src/nest/dev/base/base.service';
import { getHeader } from 'src/common/header/header';
import LogUtil from 'src/common/util/log';

const as1 = async () => {
  as2()
}

const as2 = () => {
  LogUtil.log('VersionService.getVersion => ', getHeader().token)
}

@Injectable()
export class VersionService extends BaseService {

  constructor(){
    super()
  }

  async getVersion(dto:VersionServiceDto): Promise<string> {
    LogUtil.log('VersionService.getVersion => ', executionAsyncId(), getHeader().token)
    as1()
    return this.res(require('../../../../package.json').version)
  }
}
