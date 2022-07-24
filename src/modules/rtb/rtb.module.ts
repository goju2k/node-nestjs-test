import { Module } from '@nestjs/common';
import { RfindApiModule } from 'src/apis/rfind/rfind.module';
import { RetailController } from './controllers/retail.controller';
import { RetailService } from './services/retail.service';

@Module({
  imports: [RfindApiModule],
  controllers: [RetailController],
  providers: [RetailService],
})
export class RtbModule {}
