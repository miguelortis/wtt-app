import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GeoPointDto {
  @ApiProperty({ example: 11.404, description: 'Latitud geográfica' })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -69.673, description: 'Longitud geográfica' })
  @IsNumber()
  lng: number;

  @ApiPropertyOptional({
    example: 'Punto A (Inicio)',
    description: 'Nombre descriptivo opcional del punto',
  })
  @IsString()
  @IsOptional()
  name?: string;
}

export class CreateRouteDto {
  @ApiProperty({
    example: 'Ruta Centro - Norte',
    description: 'Nombre de la ruta de transporte',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: [GeoPointDto],
    description: 'Lista ordenada de puntos geográficos que componen el trayecto',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GeoPointDto)
  points: GeoPointDto[];
}

export class UpdateRouteDto {
  @ApiPropertyOptional({
    example: 'Ruta Centro - Sur',
    description: 'Nuevo nombre de la ruta',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: [GeoPointDto],
    description: 'Nueva lista de puntos geográficos',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GeoPointDto)
  points?: GeoPointDto[];
}