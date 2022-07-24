import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import BaseController from "src/nest/dev/base/base.controller";
import { RetailService } from "../services/retail.service";

@ApiTags('RetailController')
@Controller('/retail')
export class RetailController extends BaseController {
  
  constructor(private readonly retailService: RetailService) {super()}

  @Get(':prdId')
  @ApiOperation({operationId:'getProductDetail'})
  async getProductDetail(@Param('prdId') prdId: string): Promise<string> {
    return await this.retailService.getProductDetail(prdId);
  }

}