import { Module } from '@nestjs/common';
import { DutiesController } from './duties.controller.js';
import { DutiesService } from './duties.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Duty, DutySchema } from './schemas/duty.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Duty.name, schema: DutySchema }])],
  controllers: [DutiesController],
  providers: [DutiesService]
})
export class DutiesModule {}
