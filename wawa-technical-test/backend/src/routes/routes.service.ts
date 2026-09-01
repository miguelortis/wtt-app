import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route } from './schemas/route.schema.js';

@Injectable()
export class RoutesService {
  constructor(@InjectModel(Route.name) private routeModel: Model<Route>) {}

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
}