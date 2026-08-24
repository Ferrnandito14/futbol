# 09 — Pipeline de Agentes de Producto

> Los agentes de producto operan en **tiempo real dentro de la plataforma** para cada usuario.
> Son distintos de los agentes de negocio/growth (Skills Fases 0–4) que operan para hacer crecer el proyecto/startup en sí.

---

## Regla de implementación

> ⚠️ **No implementar ningún agente sin tener los 8 campos del contrato definidos.**

Los 8 campos obligatorios del contrato de cada agente son:
1. **Rol** — Qué hace este agente / para quién trabaja
2. **Entrada** — Qué datos/eventos activan al agente
3. **Contexto/Datos** — Qué información del sistema tiene disponible
4. **Instrucción Core** — La lógica central que ejecuta
5. **Freno** — Qué lo detiene / reglas de parada / restricciones
6. **Salida** — Qué produce / entrega al usuario
7. **Siguiente agente** — A qué agente pasa el control (si aplica)
8. **Verificación** — Cómo se valida que lo hizo correctamente

---

## Agente 1 — Agente de Onboarding

| Campo | Contenido |
|---|---|
| **Rol** | Guía al nuevo usuario en el proceso de registro según su tipo de actor |
| **Entrada** | Usuario nuevo registrado; tipo de actor seleccionado |
| **Contexto/Datos** | Tipo de actor, país/región, edad declarada |
| **Instrucción Core** | Recopilar datos mínimos obligatorios según actor. Para menores: solicitar consentimiento parental antes de continuar. Para Jugador con club: exigir historial de clubes (campo obligatorio, no omitible). |
| **Freno** | No crear perfil hasta que consentimiento parental esté confirmado (menores). No avanzar sin historial de clubes (Jugador con club). |
| **Salida** | Perfil base creado con estado `incompleto` o `activo`. Checklist de datos faltantes. |
| **Siguiente agente** | Agente de Completitud de Perfil |
| **Verificación** | El perfil tiene todos los campos mínimos obligatorios del actor. Consentimiento registrado si es menor. |

---

## Agente 2 — Agente de Completitud de Perfil

| Campo | Contenido |
|---|---|
| **Rol** | Monitorea y empuja al usuario a completar su perfil |
| **Entrada** | Perfil con estado `incompleto`; sesión activa del usuario |
| **Contexto/Datos** | % de completitud del perfil, campos faltantes por actor, última actividad |
| **Instrucción Core** | Identificar campos faltantes prioritarios. Mostrar impacto de completar cada campo ("Con tu posición completada, apareces en 3x más búsquedas"). No bombardear al usuario: máximo 1 sugerencia por sesión. |
| **Freno** | No mostrar sugerencias repetidas en la misma sesión. No mostrar campos fuera del MVP actual. |
| **Salida** | Notificación contextual con 1 campo a completar y su impacto. |
| **Siguiente agente** | Agente de Matching (cuando perfil llega a completitud mínima) |
| **Verificación** | El usuario completa al menos 1 campo por semana hasta alcanzar completitud mínima. |

---

## Agente 3 — Agente de Matching

| Campo | Contenido |
|---|---|
| **Rol** | Calcula compatibilidades entre actores según criterios documentados |
| **Entrada** | Perfil con completitud mínima alcanzada; búsqueda activa o tryout publicado |
| **Contexto/Datos** | Posición, categoría, edad, zona geográfica (ofuscada para menores), disponibilidad, preferencias declaradas |
| **Instrucción Core** | Calcular score de compatibilidad entre Jugador↔Club, Familia↔Academia. Priorizar: (1) urgencia, (2) nivel competitivo requerido, (3) proximidad geográfica. No priorizar cercanía por encima de urgencia o nivel. |
| **Freno** | No revelar coordenadas exactas de menores. No presentar matches con clubes no verificados sin etiqueta de advertencia `no verificado`. |
| **Salida** | Lista ordenada de matches con score, distancia aproximada (zona, no coordenadas), y etiqueta de estado de verificación. |
| **Siguiente agente** | Agente de Contacto |
| **Verificación** | Los matches presentados cumplen todos los filtros del usuario. Ningún menor tiene coordenadas exactas expuestas. |

---

## Agente 4 — Agente de Contacto

| Campo | Contenido |
|---|---|
| **Rol** | Gestiona el proceso de contacto entre actores tras un match |
| **Entrada** | Match confirmado; intención de contacto de uno de los actores |
| **Contexto/Datos** | Estado de opt-in de ambas partes, historial de contactos previos, tipo de actores involucrados |
| **Instrucción Core** | Iniciar proceso de opt-in mutuo. Notificar a la otra parte que hay interés. Revelar información de contacto SOLO cuando ambas partes hayan dado opt-in explícito. Nunca revelar contacto automáticamente. |
| **Freno** | Contacto directo bloqueado por defecto. No revelar datos de contacto de menores bajo ninguna circunstancia sin consentimiento parental + opt-in mutuo. |
| **Salida** | Canal de comunicación habilitado entre las partes (chat interno). Notificación a ambas partes. |
| **Siguiente agente** | Agente de Seguimiento |
| **Verificación** | Ningún dato de contacto se reveló sin opt-in mutuo verificado. |

---

## Agente 5 — Agente de Seguimiento

| Campo | Contenido |
|---|---|
| **Rol** | Hace seguimiento del estado de las interacciones iniciadas |
| **Entrada** | Canal de contacto abierto entre dos actores |
| **Contexto/Datos** | Historial de mensajes, tiempo transcurrido, estado de la interacción (activa/inactiva/cerrada) |
| **Instrucción Core** | Detectar interacciones inactivas (sin respuesta en 72h). Enviar recordatorio suave a la parte que no respondió. Si pasan 7 días sin actividad, marcar interacción como `inactiva` y notificar a ambas partes. |
| **Freno** | No enviar más de 2 recordatorios por interacción. No reabrir interacciones cerradas por el usuario. |
| **Salida** | Recordatorios contextuales. Actualización de estado de la interacción. |
| **Siguiente agente** | Agente de Historial |
| **Verificación** | Las interacciones inactivas se detectan y gestionan dentro de los plazos definidos. |

---

## Agente 6 — Agente de Historial

| Campo | Contenido |
|---|---|
| **Rol** | Registra y gestiona el historial de interacciones y cambios de estado del usuario |
| **Entrada** | Cualquier evento significativo: cambio de club, tryout aplicado/completado, contacto establecido, perfil actualizado |
| **Contexto/Datos** | Timeline de eventos del usuario, entidades involucradas, fechas |
| **Instrucción Core** | Registrar evento con timestamp, tipo, entidades involucradas. Para historial de clubes de Jugador: marcar como `declarado` hasta que haya verificación oficial. Mantener trazabilidad completa. |
| **Freno** | No eliminar registros de historial (solo archivar). No marcar ningún dato como `verificado` sin fuente oficial conectada. |
| **Salida** | Entrada nueva en el historial del usuario. Timeline actualizado visible en el perfil. |
| **Siguiente agente** | — (terminal para este flujo) |
| **Verificación** | Todos los eventos tienen timestamp y estado de verificación correcto (`declarado`/`verificado`). |

---

## Agente 7 — Agente de Notificaciones

| Campo | Contenido |
|---|---|
| **Rol** | Gestiona todas las notificaciones hacia el usuario |
| **Entrada** | Evento generado por cualquier otro agente que requiera notificación al usuario |
| **Contexto/Datos** | Preferencias de notificación del usuario, canal preferido (push/email/in-app), historial de notificaciones enviadas |
| **Instrucción Core** | Consolidar notificaciones para no saturar al usuario. Respetar horarios (no enviar entre 23h–7h). Priorizar por urgencia. Agrupar notificaciones similares en un resumen si hay más de 3 en 1 hora. |
| **Freno** | Máximo 5 notificaciones push por día por usuario. No enviar notificaciones de matches a menores directamente; enviar a Familia/Representante. |
| **Salida** | Notificación enviada por el canal correspondiente. |
| **Siguiente agente** | — (transversal, recibe de todos) |
| **Verificación** | Las notificaciones de menores llegan a Familia/Representante, no al menor directamente. |

---

## Agente 8 — Agente de Moderación

| Campo | Contenido |
|---|---|
| **Rol** | Supervisa el contenido y comportamiento dentro de la plataforma |
| **Entrada** | Nuevo contenido publicado (perfil, tryout, mensaje); reporte de usuario |
| **Contexto/Datos** | Contenido a revisar, historial del actor que publicó, reglas de moderación |
| **Instrucción Core** | Revisar contenido nuevo contra reglas de moderación. Detectar información de contacto embebida en campos de texto libre (intento de bypass del sistema de opt-in). Escalar a moderación humana si hay duda. |
| **Freno** | No eliminar contenido sin revisión. No actuar sobre reportes sin verificación mínima. |
| **Salida** | Contenido aprobado / bloqueado / escalado. Notificación al autor si es bloqueado. |
| **Siguiente agente** | Agente de Notificaciones (para informar al usuario) |
| **Verificación** | Ningún dato de contacto directo aparece en campos públicos. |

---

## Agente 9 — Agente de Recomendaciones

| Campo | Contenido |
|---|---|
| **Rol** | Genera recomendaciones proactivas y personalizadas para el usuario |
| **Entrada** | Perfil activo; historial de interacciones; nuevos tryouts o perfiles que encajan |
| **Contexto/Datos** | Score de matching del usuario, búsquedas recientes, tryouts nuevos, academias nuevas en la zona |
| **Instrucción Core** | Generar máximo 3 recomendaciones por semana. Priorizar novedades (tryouts nuevos, clubes que acaban de publicar búsqueda). Personalizar por actor: Familia recibe recomendaciones de academias; Jugador recibe tryouts y clubs. |
| **Freno** | No recomendar entidades sin perfil mínimo completo. No recomendar a actores fuera del MVP (Scout, Profesionales). |
| **Salida** | Lista de hasta 3 recomendaciones con justificación breve ("Este club busca tu posición en tu categoría"). |
| **Siguiente agente** | Agente de Matching (si el usuario hace clic en una recomendación) |
| **Verificación** | Las recomendaciones son relevantes para el actor. Ninguna recomendación incluye entidades fuera del MVP. |

---

## Agente 10 — Agente de Inteligencia Geográfica (Fase Geo)

| Campo | Contenido |
|---|---|
| **Rol** | Cruza ubicación real con contexto deportivo del usuario |
| **Entrada** | Ubicación declarada o detectada del usuario; búsqueda activa |
| **Contexto/Datos** | Zona/región del usuario, densidad de clubes/academias en el área, nivel competitivo de la zona |
| **Instrucción Core** | Calcular proximidad geográfica como **tercer criterio** (después de urgencia y nivel competitivo). Presentar resultados en zona/barrio, nunca en coordenadas exactas para menores. Para mayores de edad: puede presentar distancia aproximada en km. |
| **Freno** | **NUNCA exponer coordenadas exactas de menores de edad.** No priorizar cercanía por encima de urgencia o nivel competitivo requerido. |
| **Salida** | Resultados filtrados y ordenados con contexto geográfico. Etiqueta de zona (ej: "A 5km", "En tu ciudad", "Zona norte") sin coordenadas. |
| **Siguiente agente** | Agente de Matching |
| **Verificación** | Ningún resultado para menor incluye coordenadas exactas. El orden de priorización respeta: urgencia > nivel > proximidad. |
