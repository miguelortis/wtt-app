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
1. **Migración a PostgreSQL + Prisma:** Aunque MongoDB es extremadamente flexible para almacenar los `GeoJSON` de los mapas, la validación de solapamientos bajo alta concurrencia requiere manejar transacciones manuales. Con PostgreSQL, implementaría un `EXCLUDE constraint` nativo utilizando la extensión `btree_gist`, lo que delega la responsabilidad de concurrencia directamente al motor de la base de datos con un costo de rendimiento mucho menor.
2. **Tests automatizados (Jest / Cypress):** Escribiría tests E2E y de integración enfocados exclusivamente en bombardear el endpoint de asignación con peticiones concurrentes simultáneas (`Promise.all`) para estresar el control optimista de la base de datos.
3. **Paginación en el Dashboard:** La vista actual de rutas carga todo en memoria. Con más de 100 rutas, implementaría *Infinite Scrolling* o paginación estándar apoyada por TanStack Query.