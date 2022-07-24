import {Module} from '@nestjs/common'
import { RetailController } from './controllers/retail.controller';
import { RetailService } from './services/retail.service';

@Module({
  imports: [],
  controllers: [RetailController],
  providers: [RetailService],
})
export class RtbModule {}
