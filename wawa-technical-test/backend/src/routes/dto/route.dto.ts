import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GeoPointDto {
  @ApiProperty({ example: 11.404, description: 'Latitud geográfica' })
  lat: number;

  @ApiProperty({ example: -69.673, description: 'Longitud geográfica' })
  lng: number;

  @ApiPropertyOptional({
    example: 'Punto A (Inicio)',
    description: 'Nombre descriptivo opcional del punto',
  })
  name?: string;
}

export class CreateRouteDto {
  @ApiProperty({
    example: 'Ruta Centro - Norte',
    description: 'Nombre de la ruta de transporte',
  })
  name: string;

  @ApiProperty({
    type: [GeoPointDto],
    description:
      'Lista ordenada de puntos geográficos que componen el trayecto',
  })
  points: GeoPointDto[];
}

export class UpdateRouteDto {
  @ApiPropertyOptional({
    example: 'Ruta Centro - Sur',
    description: 'Nuevo nombre de la ruta',
  })
  name?: string;

  @ApiPropertyOptional({
    type: [GeoPointDto],
    description: 'Nueva lista de puntos geográficos',
  })
  points?: GeoPointDto[];
}
