# 00 — Master Roadmap: Startup Deportiva

> **ESTADO:** Especificación completa (Etapas 1–19). Implementación en curso desde Etapa 20.

---

## Visión del producto

Una plataforma que conecta a jugadores de fútbol (con y sin club), familias, clubes, academias, scouts y profesionales (entrenador, preparador físico, fisioterapeuta, staff) según **ubicación, categoría, competición y necesidad puntual**.

---

## Actores del sistema

| Actor | Descripción |
|---|---|
| **Jugador con club** | Jugador activo en un club. Historial de clubes obligatorio. |
| **Niño/Joven sin club** | Menor de edad sin club actual. Siempre vinculado a Familia/Representante. |
| **Familia / Representante** | Tutores legales o representantes. Controlan perfil de menores. Consentimiento parental obligatorio. |
| **Club** | Entidad deportiva que busca jugadores, publica tryouts, gestiona plantilla. |
| **Academia** | Escuela de fútbol formativa. Similar a Club pero con foco en desarrollo, no competición federada. |
| **Scout** | Buscador de talento. **Fuera del MVP.** |
| **Entrenador** | Profesional técnico. **Fuera del MVP.** |
| **Preparador físico** | Profesional de condición física. **Fuera del MVP.** |
| **Fisioterapeuta** | Profesional de recuperación. **Fuera del MVP.** |
| **Staff / Utillero** | Soporte operativo al club. **Fuera del MVP.** |

---

## Casos de uso principales

### MVP — Incluidos

1. **Iniciación deportiva** — Familia busca academia/club para su hijo menor.
2. **Cambio de club** — Jugador con club busca nuevo equipo.
3. **Postulación a tryout** — Jugador aplica a convocatoria pública de un club.
4. **Publicación de tryout** — Club publica convocatoria abierta con requisitos.
5. **Búsqueda de jugadores por perfil** — Club filtra jugadores por posición, edad, categoría, zona.
6. **Verificación de club/historial** — Jugador declara historial; se marca como `declarado` hasta verificación oficial.
7. **Selección de academia por familia** — Familia compara academias por ubicación, método, edad, precio.

### Post-MVP — Excluidos del MVP

8. **Búsqueda de staff/profesional** — Club busca entrenador, preparador, fisio.
9. **Scouting activo** — Scout busca jugadores por perfil específico.
10. **Búsqueda de oportunidad laboral** — Profesional busca club donde trabajar.
11. **Recuperación/servicio complementario** — Fisio ofrece servicios puntuales.

---

## Roadmap de etapas

| Etapa | Descripción | Estado |
|---|---|---|
| 01 | Definición de actores y casos de uso | ✅ Completo |
| 02 | Modelo de negocio y monetización | ✅ Completo |
| 03 | Propuesta de valor por actor | ✅ Completo |
| 04 | Flujos de usuario principales | ✅ Completo |
| 05 | Modelo de privacidad y consentimiento | ✅ Completo |
| 06 | Política de verificación de datos | ✅ Completo |
| 07 | Sistema de matching y compatibilidad | ✅ Completo |
| 08 | Reglas de contacto y opt-in mutuo | ✅ Completo |
| 09 | Pipeline de 9 agentes de producto | ✅ Completo |
| 10 | Arquitectura de datos (20 entidades) | ✅ Completo |
| 11 | Stack técnico por capa | ✅ Completo |
| 12 | Agente de Inteligencia Geográfica (Geo) | ✅ Completo |
| 13 | Modelo de permisos y roles | ✅ Completo |
| 14 | Política de moderación de contenido | ✅ Completo |
| 15 | Estrategia de onboarding por actor | ✅ Completo |
| 16 | Plan de métricas y KPIs | ✅ Completo |
| 17 | Agentes de negocio/growth (Skills Fase 0–4) | ✅ Completo |
| 18 | Arquitectura de datos detallada | ✅ Completo |
| 19 | Arquitectura técnica detallada | ✅ Completo |
| **20** | **Implementación: Setup del proyecto y CI/CD** | 🚧 En curso |
| 21 | Implementación: Modelos de base de datos | ⬜ Pendiente |
| 22 | Implementación: API core (autenticación, perfiles) | ⬜ Pendiente |
| 23 | Implementación: Sistema de matching | ⬜ Pendiente |
| 24 | Implementación: Agentes de producto | ⬜ Pendiente |
| 25 | Implementación: Frontend MVP | ⬜ Pendiente |
| 26 | Implementación: Agente Geográfico | ⬜ Pendiente |
| 27 | QA, seguridad y revisión pre-lanzamiento | ⬜ Pendiente |
| 28 | Lanzamiento MVP | ⬜ Pendiente |

---

## Backlog de integraciones bloqueadas

| Integración | Motivo del bloqueo | Estado |
|---|---|---|
| COMET (verificación federativa) | Acceso externo pendiente (no técnico) | 🔒 Bloqueado |

> ⚠️ Hasta que COMET esté integrado, todos los datos federativos se etiquetan como `declarado`, nunca como `verificado`.

---

## Notas de implementación

- El agente de IA que trabaje en este proyecto DEBE leer `/AGENTS.md` antes de cualquier acción.
- Las especificaciones detalladas de cada etapa están en `/docs/spec/` con su número correspondiente.
- Las Skills de negocio/growth están en `/docs/skills/`.
