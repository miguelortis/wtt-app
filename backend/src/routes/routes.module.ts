import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutesController } from './routes.controller.js';
import { RoutesService } from './routes.service.js';
import { Route, RouteSchema } from './schemas/route.schema.js';
import { Duty, DutySchema } from '../duties/schemas/duty.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Route.name, schema: RouteSchema },
      { name: Duty.name, schema: DutySchema },
    ]),
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}