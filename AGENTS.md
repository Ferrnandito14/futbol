# AGENTS.md — Startup Deportiva
> Orden de lectura obligatorio y reglas no negociables para cualquier agente de IA que trabaje en este repositorio.

## Orden de lectura obligatorio

Antes de escribir UNA SOLA línea de código, el agente DEBE leer los siguientes archivos en este orden exacto:

1. Este archivo (`/AGENTS.md`)
2. `/docs/spec/00-master-roadmap.md`
3. `/docs/spec/09-agentes-producto.md`
4. `/docs/spec/10-arquitectura-datos.md`
5. `/docs/spec/11-arquitectura-tecnica.md`
6. Todos los archivos en `/docs/skills/*.md` (en orden numérico)

Si alguno de estos archivos no existe, el agente debe DETENERSE y avisar al usuario antes de continuar.

---

## Reglas no negociables

### Privacidad y menores
- **NUNCA** mostrar coordenadas exactas de menores de edad. Siempre ofuscar la ubicación (radio mínimo de 1km o zona/barrio).
- **Consentimiento parental obligatorio** antes de crear o exponer el perfil de cualquier menor de edad.
- **Contacto directo oculto por defecto.** Se revela solo con opt-in mutuo explícito. Nunca automático tras un match.

### Integridad de datos
- El **historial de clubes es OBLIGATORIO** para el actor "Jugador con club". No es opcional.
- **Nunca inventar verificaciones.** Si no hay fuente oficial conectada (ej. COMET), el dato se etiqueta como `declarado`, nunca como `verificado`.
- La integración con COMET está **bloqueada** actualmente por tema de acceso externo (no técnico) — documentado en el backlog del roadmap.

### Construcción de funciones
- **No construir funciones "porque se puede."** Solo construir capacidades que resuelven una necesidad documentada en el roadmap.
- **No inventar actores, entidades, reglas de permisos, agentes ni funciones** que no estén documentados en `/docs/spec/`.

### Alcance del MVP
El MVP incluye **únicamente** estos actores:
- Jugador (con club)
- Niño/Joven sin club + Familia/Representante
- Club / Academia

**Fuera del MVP** (no implementar hasta que el roadmap lo indique):
- Scout
- Entrenador, Preparador físico, Fisioterapeuta, Staff, Utillero

### Contratos de agentes de producto
- Cada agente de producto es un **contrato con 8 campos obligatorios:**
  1. Rol
  2. Entrada
  3. Contexto/Datos
  4. Instrucción Core
  5. Freno
  6. Salida
  7. Siguiente agente
  8. Verificación
- **No implementar ningún agente** sin tener los 8 campos definidos primero en `/docs/spec/09-agentes-producto.md`.

---

## Estado actual del proyecto

- **Etapas 1–19:** Especificación completa a nivel conceptual y documental. ✅
- **Etapa 20 en adelante:** Implementación en código. 🚧 EN CURSO

Este repositorio es el punto de partida de la implementación.

---

## Estructura del repositorio

```
/docs/spec/          → Especificación completa del producto (Etapas 1-19)
/docs/skills/        → Agentes de negocio/growth (Fases 0-4)
/docs/adr/           → Architecture Decision Records
/src/backend/        → Código del servidor (API, lógica de negocio)
/src/frontend/       → Código del cliente (web app)
/src/agents/         → Implementación de los 9 agentes de producto + Geo
/infra/              → Infraestructura (Docker, CI/CD, configs de entorno)
```

---

## Contacto y ownership

- Repositorio: [github.com/Ferrnandito14/futbol](https://github.com/Ferrnandito14/futbol)
- Proyecto: Startup Deportiva
- Última actualización de este archivo: 2026-08-24
