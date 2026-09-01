import { Module } from '@nestjs/common';
import { DutiesController } from './duties.controller.js';
import { DutiesService } from './duties.service.js';

@Module({
  controllers: [DutiesController],
  providers: [DutiesService]
})
export class DutiesModule {}
