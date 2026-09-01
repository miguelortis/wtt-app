import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateDutyDto {
  @ApiProperty({ example: '64a7f2b1e4b0c8a1b2c3d4e5', description: 'ID de la ruta a la que se asocia el duty' })
  @IsString()
  @IsNotEmpty()
  routeId: string;

  @ApiProperty({ example: 'VW-GOL-01', description: 'Identificador único de la unidad o vehículo' })
  @IsString()
  @IsNotEmpty()
  unitId: string;

  @ApiProperty({ example: '2026-06-01T10:00:00.000Z', description: 'Hora de inicio de la ventana horaria (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '2026-06-01T12:00:00.000Z', description: 'Hora de fin de la ventana horaria (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}