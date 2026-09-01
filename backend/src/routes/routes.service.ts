import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route } from './schemas/route.schema.js';
import { Duty } from '../duties/schemas/duty.schema.js';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<Route>,
    @InjectModel(Duty.name) private dutyModel: Model<Duty>,
  ) {}

  async create(createRouteDto: any) {
    const newRoute = new this.routeModel(createRouteDto);
    return newRoute.save();
  }

  async findAll() {
    return this.routeModel.find().exec();
  }

  async findOne(id: string) {
    const route = await this.routeModel.findById(id).exec();
    if (!route) throw new NotFoundException('Ruta no encontrada');
    return route;
  }

  async update(id: string, updateData: any) {
    const updatedRoute = await this.routeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedRoute) throw new NotFoundException('Ruta no encontrada');
    return updatedRoute;
  }

  async remove(id: string) {
    const deletedRoute = await this.routeModel.findByIdAndDelete(id).exec();
    if (!deletedRoute) {
      throw new NotFoundException('Ruta no encontrada');
    }
    
    await this.dutyModel.deleteMany({ routeId: id }).exec();

    return { message: 'Ruta e historial de duties eliminados exitosamente' };
  
}
}