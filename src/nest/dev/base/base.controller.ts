import { ApiBearerAuth } from "@nestjs/swagger"
import BaseAbstract from "./base.abstract"

@ApiBearerAuth()
export default class BaseController extends BaseAbstract {}
