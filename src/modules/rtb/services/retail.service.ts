import { Injectable, Req } from "@nestjs/common";
import BaseService from "src/nest/dev/base/base.service";

@Injectable()
export class RetailService extends BaseService {

  constructor(){
    super()
  }

  async getProductDetail(bldId: string): Promise<string> {
    return this.res(JSON.stringify(bldId))
  }

}