import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Subesquema para los puntos geográficos
@Schema({ _id: false }) 
export class GeoPoint {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;

  @Prop({ required: false })
  name?: string;
}
const GeoPointSchema = SchemaFactory.createForClass(GeoPoint);

@Schema({ timestamps: true })
export class Route extends Document {
  @Prop({ required: true })
  name: string; // Identificador visual para la UI

  @Prop({ type: [GeoPointSchema], required: true })
  points: GeoPoint[]; // El array mantiene el orden de los puntos automáticamente
}

export const RouteSchema = SchemaFactory.createForClass(Route);