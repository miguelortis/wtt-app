import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { RoutesModule } from './routes/routes.module.js';
import { DutiesModule } from './duties/duties.module.js';

@Module({
  imports: [DatabaseModule, RoutesModule, DutiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
