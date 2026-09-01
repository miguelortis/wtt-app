import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { DutiesService } from './duties.service.js';
import { CreateDutyDto } from './dto/create-duty.dto.js';

@Controller('duties')
export class DutiesController {
  constructor(private readonly dutiesService: DutiesService) {}

  @Post()
  async create(@Body() createDutyDto: CreateDutyDto) {
    return this.dutiesService.createDuty(
      createDutyDto.routeId,
      createDutyDto.unitId,
      new Date(createDutyDto.startTime),
      new Date(createDutyDto.endTime)
    );
  }

  @Get('route/:routeId')
  async getByRoute(@Param('routeId') routeId: string) {
    return this.dutiesService.getDutiesByRoute(routeId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dutiesService.remove(id);
  }
}