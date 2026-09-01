import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Duty } from './schemas/duty.schema.js';

@Injectable()
export class DutiesService {
  constructor(@InjectModel(Duty.name) private dutyModel: Model<Duty>) {}

  async createDuty(
    routeId: string,
    unitId: string,
    startTime: Date,
    endTime: Date,
  ) {
    // 1. Iniciamos la sesión transaccional
    const session = await this.dutyModel.db.startSession();
    session.startTransaction();

    try {
      // 2. Consulta matemática de solapamiento: (NuevoInicio < FinExistente) Y (NuevoFin > InicioExistente)
      const overlappingDuty = await this.dutyModel
        .findOne({
          unitId,
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        })
        .session(session); // Obligamos a que la consulta viva dentro de la transacción

      if (overlappingDuty) {
        throw new ConflictException(
          'La unidad ya tiene un duty asignado en este horario.',
        );
      }

      // 3. Si no hay conflicto, preparamos el guardado
      const newDuty = new this.dutyModel({
        routeId,
        unitId,
        startTime,
        endTime,
      });

      // 4. Guardamos e impactamos la base de datos
      await newDuty.save({ session });
      await session.commitTransaction();

      return newDuty;
    } catch (error) {
      // 5. Si ocurre cualquier error (incluyendo concurrencia), revertimos el estado
      await session.abortTransaction();
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Error al asignar el duty por problemas de concurrencia.',
      );
    } finally {
      await session.endSession();
    }
  }

  async getDutiesByRoute(routeId: string) {
    return this.dutyModel.find({ routeId }).sort({ startTime: 1 }).exec();
  }

  async remove(id: string) {
    const deletedDuty = await this.dutyModel.findByIdAndDelete(id).exec();
    if (!deletedDuty) throw new NotFoundException('Duty no encontrado');
    return { message: 'Duty eliminado exitosamente' };
  }
}
