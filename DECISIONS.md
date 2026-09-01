# Bitácora de Decisiones (DECISIONS.md)

## 1. Estructura del Proyecto
He decidido estructurar el proyecto alojando el backend (NestJS) y el frontend (Next.js) en un mismo repositorio. Esto facilita la revisión del código por parte del equipo evaluador y me permite gestionar los commits de forma unificada para mostrar la evolución completa del MVP en un solo lugar.

## 2. Modelado de Datos y Prevención de Solapamientos
Para la base de datos, he estructurado los esquemas en MongoDB habilitando `versionKey: '__v'` de Mongoose y creando índices compuestos (`unitId`, `startTime`, `endTime`).

**Decisión Arquitectónica:** Dado que MongoDB no soporta *Exclude Constraints* nativos para rangos de tiempo (como PostgreSQL), la responsabilidad de mantener la integridad recae en el backend. El índice compuesto garantiza que las consultas de validación previas à la inserción sean O(log N) y no escaneos completos de colección, preparando el terreno para envolver la operación en una Transacción ACID.

## 3. Resolución de Concurrencia (Transacciones ACID)
**El problema:** El reto principal consistía en asegurar la integridad de la base de datos cuando múltiples peticiones concurrentes intentan asignar *duties* a una misma unidad en el mismo bloque temporal. 

**La decisión:** En lugar de realizar una verificación lineal (leer, validar, insertar) —la cual es vulnerable a *race conditions*—, encapsulé la validación matemática de los tiempos (`$lt` y `$gt`) y la creación del documento dentro de una misma `Session` de Mongoose ejecutando `startTransaction()`. 

**Impacto:** Esto asegura que la operación sea atómica. Si dos hilos validan la disponibilidad al mismo tiempo, el motor de la base de datos bloqueará o abortará la segunda transacción, protegiendo la regla de negocio.

## 4. Modelado de Rutas y Puntos Geográficos
Para las rutas, estructuré los datos utilizando un subdocumento incrustado (`GeoPointSchema`) dentro de un array en el documento principal de `Route`. 

**Por qué:** El requerimiento pide que la ruta sea una lista ordenada. Los arrays en MongoDB preservan el orden de inserción de forma nativa. Al incrustar los puntos en lugar de referenciarlos, evitamos consultas costosas tipo `$lookup` (JOINs) al leer la ruta, optimizando el tiempo de respuesta para la vista de detalle en el mapa.

## 5. Integración de Mapas en Next.js (App Router)
Para cumplir con la visualización de rutas geográficas, elegí **Leaflet (react-leaflet)** por ser ligero y de código abierto.

**El reto:** Leaflet hace referencia al objeto global `window` inmediatamente, lo cual causa crashes durante el Server-Side Rendering (SSR) de Next.js.
**La solución:** El componente de mapa se importa dinámicamente utilizando `next/dynamic` con la opción `{ ssr: false }`. Esto garantiza que la hidratación del mapa ocurra estrictamente en el cliente (Browser), evitando errores de build y manteniendo la velocidad inicial de carga de la página.

## 6. Conducción de IA y Criterio de Selección
Durante el desarrollo, utilicé IA como herramienta de *scaffolding* y generación rápida de código, pero tomé el control directivo en las decisiones críticas:

* **Corrección en el manejo de concurrencia (El Core):** Inicialmente, la IA sugirió resolver el solapamiento de ventanas horarias haciendo un simple `findOne()` seguido de un `.save()`. Rechacé esta propuesta porque creaba una ventana vulnerable a *race conditions*. Forcé a la IA a reescribir el endpoint implementando `startSession()` y encapsulando la lógica en una **Transacción ACID**, priorizando la integridad sobre la simplicidad.
* **Refinamiento de la UI:** La IA propuso en un principio formularios y alertas nativas de HTML/CSS. Decidí descartar ese enfoque e instruí la integración de **Ant Design combinado con Tailwind CSS**. Esto me permitió manejar los errores HTTP 409 (Conflict) del backend con notificaciones asíncronas precisas, dándole al MVP un estándar visual de SaaS logístico.

## 7. Validación Estricta de Entradas (Input Validation)
Para garantizar la seguridad y robustez de la API, se configuró un `ValidationPipe` global en NestJS con `whitelist: true` y `forbidNonWhitelisted: true`. Esto asegura que cualquier payload malicioso o con propiedades no declaradas en los DTOs sea rechazado automáticamente con un error HTTP 400 antes de ejecutar la lógica de negocio o interactuar con la base de datos.