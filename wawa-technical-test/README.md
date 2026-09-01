# WAWA Transport MVP - Prueba Técnica

## 🚀 Cómo levantar el proyecto localmente

Este proyecto está estructurado como un monorepo lógico. Requiere Node.js y MongoDB.

### 1. Backend (NestJS)
1. Entra a la carpeta: `cd backend`
2. Instala dependencias: `npm install`
3. Configura el `.env`: Crea un archivo `.env` en la raíz de `backend` y añade tu URI de conexión (idealmente un clúster de Atlas para soportar transacciones ACID):
   `MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/wawa?retryWrites=true&w=majority`
4. Levanta el servidor: `npm run start:dev` (Correrá en http://localhost:3001)

### 2. Frontend (Next.js)
1. Abre otra terminal y entra a la carpeta: `cd frontend`
2. Instala dependencias: `npm install`
3. Levanta el servidor: `npm run dev` (Correrá en http://localhost:3000)

---

## 🎯 Qué se construyó (Visión de Producto)
Se desarrolló el núcleo funcional de un sistema de planificación de transporte enfocado en la **integridad de las asignaciones (Duties)**. 

El MVP permite visualizar rutas geográficas interactivas y asignar vehículos a ventanas horarias específicas. La arquitectura del sistema garantiza que es matemáticamente y transaccionalmente imposible asignar una misma unidad a dos duties que se solapen en el tiempo, respondiendo con un error `409 Conflict` manejado elegantemente en la interfaz gráfica.

## 🛑 Qué se dejó fuera conscientemente y por qué
- **Autenticación / JWT / Roles:** Se omitió porque el foco de las ~5 horas de la prueba técnica era la concurrencia y la lógica de negocio espacial/temporal, no el boilerplate de seguridad.
- **Validación de distancia/tiempo de viaje:** No se incluyó una integración con APIs de routing (ej. Google Directions) para calcular si una unidad tiene tiempo físico de llegar del punto B al punto A entre dos duties distintos.
- **Dockerización:** Se decidió invertir el tiempo en resolver el *race condition* de la base de datos en lugar de configurar contenedores para el entorno local.

## 💡 Qué haría distinto con más tiempo
1. **WebSockets (Socket.io) para Actualizaciones en Tiempo Real:** Implementaría comunicación bidireccional para que, si múltiples operadores gestionan la flota simultáneamente, las asignaciones de *duties* y la creación de rutas se reflejen al instante en las pantallas de todos los usuarios conectados sin necesidad de recargar la página.
2. **Pruebas Automatizadas de Concurrencia (Jest / Supertest):** Escribiría una suite de pruebas de integración enfocada en simular condiciones de carrera (*race conditions*), bombardeando el endpoint de asignación con solicitudes masivas y simultáneas (`Promise.all`) para estresar y certificar la atomicidad de las transacciones.
3. **Diseño UI/UX Avanzado y Analíticas de Flota:** Evolucionaría el panel incorporando métricas de utilización de la flota (gráficos de rendimiento y disponibilidad de vehículos), filtros avanzados por fecha/unidad, y herramientas de edición de rutas más visuales directamente sobre el mapa.