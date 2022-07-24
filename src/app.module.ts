import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module'
import { RtbModule } from './modules/rtb/rtb.module'

@Module({
  imports: [CoreModule, RtbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
