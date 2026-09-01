import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { RoutesService } from './routes.service.js';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto.js';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateRouteDto) {
    return this.routesService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ruta completa' })
  @ApiParam({ name: 'id', description: 'ID único de la ruta' })
  @ApiResponse({ status: 200, description: 'Ruta eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada.' })
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}