import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitamos CORS para evitar problemas en el navegador con Next.js
  app.enableCors();
  
  // Asignamos el puerto 3001 para que no haya conflicto con el frontend
  await app.listen(3001);
}
bootstrap();