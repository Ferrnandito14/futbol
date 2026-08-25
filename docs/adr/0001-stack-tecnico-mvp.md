# ADR 0001 — Stack Técnico del MVP

## Estado
Aceptado

## Contexto
Startup Deportiva necesita una arquitectura escalable, fuertemente tipada, orientada a eventos para el pipeline de 10 agentes de producto, y con capacidades geoespaciales nativas para la búsqueda segura de clubes, academias y tryouts.

## Decisión
Se define el siguiente stack técnico para el MVP:
1. **Lenguaje Core:** TypeScript en todo el stack para compartir contratos de datos y tipos de agentes entre backend y frontend.
2. **Base de Datos:** PostgreSQL con extensión PostGIS para cálculo de distancias de zonas sin exponer coordenadas exactas de menores.
3. **ORM:** Prisma para definición declarativa y type-safe de las 20 entidades.
4. **Backend API:** Fastify por su alto rendimiento y validación de schemas con Zod.
5. **Frontend:** Next.js 14 con React, Tailwind CSS y componentes accesibles (shadcn/ui).
6. **Agentes y Colas:** Módulos TypeScript puros con orquestación asíncrona soportada por Redis/BullMQ.

## Consecuencias
- Mantenibilidad alta gracias al tipado estricto de extremo a extremo.
- Compatibilidad nativa con PostGIS para el Agente de Inteligencia Geográfica.
- Desacoplamiento total de los 10 agentes de producto como contratos auditables en `AgentLog`.
