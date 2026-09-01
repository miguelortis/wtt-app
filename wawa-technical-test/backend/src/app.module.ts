import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutesModule } from './routes/routes.module.js';
import { DutiesModule } from './duties/duties.module.js';

@Module({
  imports: [
    // isGlobal permite usar variables de entorno en cualquier parte del proyecto
    ConfigModule.forRoot({ isGlobal: true }),
    // Conexión asíncrona asegurando que la variable MONGODB_URI ya fue leída
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    RoutesModule,
    DutiesModule,
  ],
})
export class AppModule {}