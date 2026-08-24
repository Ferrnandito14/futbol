# Skills — Agentes de Negocio y Growth (Fases 0–4)

> Los agentes de Skills operan para hacer crecer el **proyecto/startup en sí**.
> Son distintos de los 9 agentes de producto que operan dentro de la plataforma para cada usuario.

---

## Diferencia clave

| Agentes de Producto (spec/09) | Agentes de Skills (este archivo) |
|---|---|
| Operan dentro de la plataforma | Operan fuera de la plataforma |
| Sirven a los usuarios finales | Sirven al equipo fundador |
| Se activan por eventos de usuario | Se activan por el equipo o por schedule |
| Objetivo: experiencia del usuario | Objetivo: crecimiento del negocio |

---

## Fase 0 — Validación y Fundamentos

### Skill 0.1 — Agente de Investigación de Mercado

**Objetivo:** Validar que existe demanda real en el mercado objetivo antes de construir.

**Actividades:**
- Mapear competidores directos e indirectos (Footters, Scouting Apps, Wyscout, etc.)
- Identificar gaps no cubiertos por competidores
- Estimar tamaño del mercado en España/LATAM
- Documentar hallazgos en `/docs/spec/market-research.md`

**Output esperado:** Informe de competencia + estimación TAM/SAM/SOM.

---

### Skill 0.2 — Agente de Definición de ICP

**Objetivo:** Definir el Ideal Customer Profile para cada actor del MVP.

**Actividades:**
- Crear perfil detallado de Jugador con club tipo (edad, categoría, motivación)
- Crear perfil detallado de Familia tipo (hijo menor, motivación, obstáculos)
- Crear perfil detallado de Club tipo (tamaño, categoría, problema principal)
- Crear perfil detallado de Academia tipo

**Output esperado:** Documento ICP con 4 perfiles detallados.

---

## Fase 1 — Tracción Inicial (Pre-lanzamiento)

### Skill 1.1 — Agente de Contenido de Arranque

**Objetivo:** Generar contenido para construir audiencia antes del lanzamiento.

**Canales objetivo:** Instagram, TikTok, LinkedIn (para clubs y academias).

**Actividades:**
- Crear calendario de contenido para 30 días pre-lanzamiento
- Generar ideas de contenido por actor (jugadores, familias, clubs)
- Templates para historias de éxito (sin datos reales hasta tener usuarios)

**Output esperado:** Calendario de contenido + 10 posts listos.

---

### Skill 1.2 — Agente de Partnerships Pre-Lanzamiento

**Objetivo:** Conseguir los primeros 5 clubs/academias partners antes del lanzamiento.

**Actividades:**
- Identificar clubs y academias objetivo por zona geográfica piloto
- Crear pitch deck para clubs y academias
- Script de cold outreach por email y WhatsApp
- Proceso de onboarding para partners fundadores

**Output esperado:** Lista de 20 clubs objetivo + pitch deck + script de outreach.

---

## Fase 2 — Lanzamiento MVP

### Skill 2.1 — Agente de Onboarding de Primeros Usuarios

**Objetivo:** Conseguir los primeros 100 usuarios activos (no registros, usuarios activos).

**Actividades:**
- Definir el funnel de activación por actor
- Identificar el "momento AHA" para cada actor
- Crear secuencia de onboarding emails para los primeros 7 días
- Protocolo de seguimiento manual para primeros 20 usuarios

**Output esperado:** Funnel de activación documentado + secuencia de emails.

---

### Skill 2.2 — Agente de Métricas de Arranque

**Objetivo:** Definir y monitorear las métricas clave del MVP.

**KPIs prioritarios:**
- DAU / MAU ratio
- Tiempo hasta primer match
- % de perfiles con completitud > 70%
- % de matches que llegan a opt-in mutuo
- Churn en primeros 30 días

**Output esperado:** Dashboard de métricas configurado + alertas.

---

## Fase 3 — Crecimiento

### Skill 3.1 — Agente de Referidos

**Objetivo:** Diseñar e implementar un programa de referidos para cada actor.

**Mecánicas por actor:**
- Jugador refiere jugador → visibilidad extra en búsquedas
- Familia refiere familia → acceso a funciones premium (cuando existan)
- Club refiere club → — (no incentivado; son competidores)
- Club refiere jugadores → no aplica (conflicto de interés)

---

### Skill 3.2 — Agente de Expansión Geográfica

**Objetivo:** Definir la estrategia de expansión de zona piloto a nuevas ciudades.

**Criterios para nueva zona:**
- Demanda demostrada (>50 usuarios en lista de espera)
- Al menos 2 clubs/academias partners en la zona
- Cobertura geográfica suficiente para que el matching tenga sentido

---

## Fase 4 — Escalado

### Skill 4.1 — Agente de Internacionalización

**Objetivo:** Preparar la plataforma para mercados fuera de España.

**Mercados prioritarios:** Portugal, México, Argentina.

**Actividades:**
- Adaptar modelo de verificación (COMET → equivalentes locales)
- Adaptar categorías federativas por país
- Localización de idioma (PT-BR, ES-MX, ES-AR)

---

### Skill 4.2 — Agente de Monetización

**Objetivo:** Activar el modelo de monetización una vez validado el producto.

**Modelos candidatos:**
- Freemium: perfil básico gratuito, funciones premium de pago
- SaaS para clubs: suscripción mensual para clubs con acceso a búsqueda avanzada
- Comisión por match exitoso (complejidad alta, post-MVP)

> ⚠️ **No implementar monetización en el MVP.** El objetivo del MVP es validar el matching y la retención, no monetizar.

---

## Notas para el agente de IA

- Las Skills de negocio **no se implementan en código**; son guías operativas para el equipo fundador.
- Cuando se pida "ejecutar una skill", el agente debe producir el **output esperado** descrito (documentos, scripts, calendarios), no código de software.
- Las Skills no tienen acceso a datos de usuarios de la plataforma.
