# 11 — Arquitectura Técnica

> Stack técnico candidato por capa para el MVP de Startup Deportiva.
> Las decisiones definitivas se documentan en `/docs/adr/`.

---

## Principios de diseño

1. **Mobile-first** — La plataforma es principalmente de uso móvil (familias, jugadores en campo).
2. **Privacy-by-design** — Privacidad integrada desde la capa de datos, no añadida después.
3. **Modular** — Cada agente de producto es un módulo independiente con contratos claros.
4. **Escalar gradualmente** — MVP simple y funcional. Optimizar solo cuando haya datos de uso real.
5. **Observabilidad** — Logs de agentes (`AgentLog`) desde el día 1.

---

## Stack por capa

### Frontend

| Capa | Tecnología candidata | Justificación |
|---|---|---|
| Framework | **Next.js 14** (React) | SSR para SEO, App Router, soporte mobile-web |
| Estilos | **Tailwind CSS** | Velocidad de desarrollo, responsive por defecto |
| Componentes UI | **shadcn/ui** | Accesible, sin lock-in, personalizable |
| Estado global | **Zustand** | Ligero, sin boilerplate |
| Formularios | **React Hook Form + Zod** | Validación tipada, integración con backend |
| Mapas (Geo) | **Mapbox GL JS** | Soporte de zonas/polígonos, no puntos exactos |
| i18n | **next-intl** | Soporte multiidioma (ES, PT, EN en el roadmap) |

---

### Backend / API

| Capa | Tecnología candidata | Justificación |
|---|---|---|
| Runtime | **Node.js** | Ecosistema amplio, mismo lenguaje que frontend |
| Framework API | **Fastify** | Más rápido que Express, tipado nativo |
| ORM | **Prisma** | Type-safe, migraciones automatizadas, DX excelente |
| Validación | **Zod** | Contratos de API tipados, compartible con frontend |
| Autenticación | **Supabase Auth** o **Auth.js** | JWT + OAuth, gestión de sesiones |
| Queue/Jobs | **BullMQ** (Redis) | Para tareas asíncronas de agentes |
| WebSockets | **Socket.io** o **Supabase Realtime** | Chat en tiempo real |

---

### Base de datos

| Capa | Tecnología candidata | Justificación |
|---|---|---|
| Principal | **PostgreSQL** (via Supabase) | Relacional, soporta GeoJSON/PostGIS para Agente Geo |
| Caché | **Redis** | Sesiones, queues, rate limiting |
| Búsqueda | **PostgreSQL Full-Text Search** (MVP) → **Meilisearch** (post-MVP) | Búsqueda de jugadores y clubs |
| Almacenamiento archivos | **Supabase Storage** o **Cloudflare R2** | Fotos de perfil, documentos de consentimiento |

---

### Agentes de Producto

| Componente | Tecnología candidata | Justificación |
|---|---|---|
| Orquestador | **BullMQ** jobs | Eventos disparan agentes de forma asíncrona |
| Lógica de agentes | **TypeScript modules** | Un archivo/módulo por agente, contrato tipado |
| Logs de agentes | **AgentLog** en PostgreSQL | Trazabilidad completa de acciones |
| Matching engine | **SQL + scoring functions** (MVP) | Sin ML en MVP; reglas explícitas y auditables |

---

### Infraestructura

| Capa | Tecnología candidata | Justificación |
|---|---|---|
| Hosting frontend | **Vercel** | Zero-config, CI/CD automático, Edge Network |
| Hosting backend | **Railway** o **Render** | Simple, Docker-based, escala automático |
| Base de datos | **Supabase** (managed PostgreSQL) | Incluye Auth, Storage, Realtime |
| CDN | **Cloudflare** | Performance, DDoS protection |
| DNS | **Cloudflare** | — |
| Monitoreo | **Sentry** (errores) + **Axiom** (logs) | — |
| CI/CD | **GitHub Actions** | Tests, linting, deploy automático |

---

### Seguridad y privacidad

| Requisito | Implementación |
|---|---|
| Coordenadas exactas de menores | Cifradas en BD con AES-256. Nunca en API responses. |
| Consentimiento parental | Tabla `ParentalConsent` con IP, fecha y método. |
| Contacto directo | Bloqueado a nivel de API middleware. Solo habilitado con doble opt-in verificado en BD. |
| Rate limiting | Redis + Fastify rate-limit plugin |
| CORS | Configurado por entorno (dev / staging / prod) |
| Secrets | Variables de entorno. Nunca en código. `.env` en `.gitignore`. |
| Auditoría | `AgentLog` + `ModerationLog` para todas las acciones sensibles |

---

## Estructura de carpetas del código

```
/src
  /backend
    /api             → Rutas de la API (Fastify routes)
    /services        → Lógica de negocio
    /agents          → Un módulo por agente de producto
    /db              → Prisma schema y migraciones
    /middleware      → Auth, rate-limit, privacy guards
    /utils           → Helpers compartidos
  /frontend
    /app             → Next.js App Router
    /components      → Componentes UI reutilizables
    /lib             → Clientes de API, helpers
    /stores          → Zustand stores
    /hooks           → Custom hooks
  /agents            → Definición de contratos de agentes (TypeScript interfaces)
/infra
  /docker            → Dockerfiles
  /github-actions    → Workflows de CI/CD
  /.env.example      → Variables de entorno necesarias (sin valores)
/docs
  /spec              → Especificación del producto
  /skills            → Agentes de negocio/growth
  /adr               → Architecture Decision Records
```

---

## Variables de entorno requeridas

```env
# Base de datos
DATABASE_URL=

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis
REDIS_URL=

# Auth
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Mapbox (Agente Geo)
MAPBOX_API_KEY=

# Monitoreo
SENTRY_DSN=

# Entorno
NODE_ENV=development
```

---

## Decisiones pendientes de ADR

| Decisión | Opciones | Estado |
|---|---|---|
| Auth: Supabase vs Auth.js | Supabase Auth / Auth.js (NextAuth) | ⬜ Pendiente |
| Chat: Socket.io vs Supabase Realtime | Socket.io / Supabase Realtime | ⬜ Pendiente |
| Backend hosting: Railway vs Render vs Fly.io | Railway / Render / Fly.io | ⬜ Pendiente |
| Storage: Supabase Storage vs Cloudflare R2 | Supabase Storage / R2 | ⬜ Pendiente |

> Los ADRs se documentan en `/docs/adr/` con el formato estándar (contexto, decisión, consecuencias).
