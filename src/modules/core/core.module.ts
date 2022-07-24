import { Module } from '@nestjs/common';
import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';

@Module({
  imports: [],
  controllers: [VersionController],
  providers: [VersionService],
})
export class CoreModule {}
