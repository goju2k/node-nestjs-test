import { Injectable, Req } from "@nestjs/common";
import { BldControllerApi, SelectBldPrdListForScreenOut } from "src/apis/rtb";
import {executionAsyncId} from 'async_hooks'
import BaseService from "src/nest/dev/base/base.service";
import WwwMbrPublicService from "src/apis/rfind/services/WwwMbrPublicService";
// import { WwwGetBldUnitOut, WwwMbrPublicControllerApi } from "src/apis/rfind";

@Injectable()
export class RetailService extends BaseService {

  constructor(private readonly wwwMbrPublicService: WwwMbrPublicService){
    super()
  }

  async getProductDetail(bldId: string): Promise<string> {

    const out = await new BldControllerApi().selectBldPrdListForScreen(
      '',
      bldId
    ) as unknown as SelectBldPrdListForScreenOut[]

    //console.log('out => ', out);

    const input = {bldId, prdId:out[0]['prdId'], exteriorDispYn:'N', mbrLev:1}
    
    const out2 = await this.wwwMbrPublicService.getBldOffice(bldId)
    //console.log('out2 => ', out2);

    // const out3 = await new WwwMbrPublicControllerApi().getBldOne(bldId, (out[0] as SelectBldPrdListForScreenOut).prdId, 'N', 3)
    // console.log('out3 => ', out3);
    
    return this.res(JSON.stringify(bldId))
    //return this.res(prdId)
  }

}