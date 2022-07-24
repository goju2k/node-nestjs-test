import { Module } from '@nestjs/common';
import { RfindApiModule } from 'src/apis/rfind/rfind.module';
import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';

@Module({
  imports: [RfindApiModule],
  controllers: [VersionController],
  providers: [VersionService],
})
export class CoreModule {}
