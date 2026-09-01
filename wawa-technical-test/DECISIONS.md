# Bitácora de Decisiones (DECISIONS.md)

## 1. Estructura del Proyecto
He decidido estructurar el proyecto alojando el backend (NestJS) y el frontend (Next.js) en un mismo repositorio. Esto facilita la revisión del código por parte del equipo evaluador y me permite gestionar los commits de forma unificada para mostrar la evolución completa del MVP en un solo lugar.

## 2. Modelado de Datos y Prevención de Solapamientos
Para la base de datos, he estructurado los esquemas en MongoDB habilitando `versionKey: '__v'` de Mongoose y creando índices compuestos (`unitId`, `startTime`, `endTime`).

**Decisión Arquitectónica:** Dado que MongoDB no soporta *Exclude Constraints* nativos para rangos de tiempo (como PostgreSQL), la responsabilidad de mantener la integridad recae en el backend. El índice compuesto garantiza que las consultas de validación previas a la inserción sean O(log N) y no escaneos completos de colección, preparando el terreno para envolver la operación en una Transacción ACID.