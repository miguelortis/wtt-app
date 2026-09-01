import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DutiesService } from './duties.service.js';

@Controller('duties')
export class DutiesController {
  constructor(private readonly dutiesService: DutiesService) {}

  @Post()
  async create(@Body() body: { routeId: string; unitId: string; startTime: string; endTime: string }) {
    return this.dutiesService.createDuty(
      body.routeId,
      body.unitId,
      new Date(body.startTime),
      new Date(body.endTime)
    );
  }

  @Get('route/:routeId')
  async getByRoute(@Param('routeId') routeId: string) {
    return this.dutiesService.getDutiesByRoute(routeId);
  }
}