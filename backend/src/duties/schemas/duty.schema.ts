import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: '__v' })
export class Duty extends Document {
  @Prop({ required: true, type: String })
  routeId: string; // Usaremos un string simple para el MVP, aunque podría ser un ObjectId

  @Prop({ required: true, index: true })
  unitId: string; // El identificador del vehículo a validar

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;
}

export const DutySchema = SchemaFactory.createForClass(Duty);

// Índice compuesto crítico para la base de datos. 
// Acelera drásticamente la búsqueda de solapamientos cuando filtramos por unidad y tiempo.
DutySchema.index({ unitId: 1, startTime: 1, endTime: 1 });