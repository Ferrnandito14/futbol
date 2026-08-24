# 10 — Arquitectura de Datos (20 Entidades)

> Modelo de datos completo del sistema. Todas las entidades del MVP y post-MVP.
> El estado de verificación de datos federativos es siempre `declarado` hasta que COMET esté integrado.

---

## Entidades del MVP

### 1. `User` — Usuario base del sistema

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `email` | String | Email único, verificado |
| `phone` | String | Teléfono (opcional) |
| `actor_type` | Enum | `player_with_club`, `child`, `family`, `club`, `academy` |
| `status` | Enum | `pending_consent`, `incomplete`, `active`, `suspended` |
| `created_at` | DateTime | — |
| `updated_at` | DateTime | — |

---

### 2. `PlayerProfile` — Perfil de Jugador con club

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | — |
| `full_name` | String | — |
| `birth_date` | Date | — |
| `nationality` | String | — |
| `position_primary` | Enum | Posición principal |
| `position_secondary` | Enum | Posición secundaria (opcional) |
| `dominant_foot` | Enum | `left`, `right`, `both` |
| `height_cm` | Int | — |
| `weight_kg` | Int | — |
| `category` | Enum | Categoría federativa (benjamín, alevín, infantil, cadete, juvenil, senior, etc.) |
| `club_history` | FK → ClubHistory[] | **OBLIGATORIO. No puede estar vacío.** |
| `current_club_id` | FK → Club | Club actual (nullable si está en búsqueda) |
| `looking_for_club` | Boolean | Si está activamente buscando club |
| `profile_completeness` | Int | % de completitud (0–100) |
| `location_zone` | String | Zona/ciudad (nunca coordenadas exactas) |
| `visibility` | Enum | `public`, `clubs_only`, `hidden` |

---

### 3. `ChildProfile` — Perfil de Niño/Joven sin club

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | — |
| `full_name` | String | — |
| `birth_date` | Date | — |
| `age_category` | Enum | Grupo de edad (prebenjamín, benjamín, alevín, infantil, cadete, juvenil) |
| `position_interest` | String | Posición de interés (declarada por familia) |
| `experience_level` | Enum | `none`, `recreational`, `federated` |
| `family_id` | FK → FamilyProfile | **OBLIGATORIO. Menor siempre vinculado a familia.** |
| `parental_consent` | Boolean | **OBLIGATORIO. False = perfil no visible.** |
| `parental_consent_date` | DateTime | Fecha de consentimiento |
| `location_zone` | String | Zona/ciudad. **NUNCA coordenadas exactas.** |

---

### 4. `FamilyProfile` — Perfil de Familia/Representante

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | — |
| `contact_name` | String | Nombre del responsable |
| `relationship` | Enum | `parent`, `guardian`, `legal_representative` |
| `children` | FK → ChildProfile[] | Menores vinculados |
| `preferences` | JSON | Preferencias de búsqueda (zona, tipo de club, etc.) |
| `location_zone` | String | — |

---

### 5. `ClubProfile` — Perfil de Club

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | — |
| `official_name` | String | Nombre oficial |
| `short_name` | String | Nombre corto |
| `federation` | String | Federación a la que pertenece |
| `federation_id` | String | ID en la federación (`declarado` hasta verificación COMET) |
| `federation_status` | Enum | `declared`, `verified` |
| `founded_year` | Int | — |
| `categories_active` | Enum[] | Categorías con equipo activo |
| `location_address` | String | Dirección (visible para mayores) |
| `location_zone` | String | Zona/ciudad |
| `contact_email` | String | Oculto por defecto; visible con opt-in mutuo |
| `contact_phone` | String | Oculto por defecto |
| `profile_completeness` | Int | % de completitud |
| `verified` | Boolean | Verificación de identidad del club |

---

### 6. `AcademyProfile` — Perfil de Academia

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | — |
| `official_name` | String | — |
| `methodology` | String | Método pedagógico |
| `age_range_min` | Int | Edad mínima de admisión |
| `age_range_max` | Int | Edad máxima de admisión |
| `categories_active` | Enum[] | — |
| `price_range` | Enum | `free`, `low`, `medium`, `high` |
| `location_zone` | String | — |
| `location_address` | String | Visible para familias |
| `federated` | Boolean | Si está federada |
| `verified` | Boolean | — |

---

### 7. `ClubHistory` — Historial de clubes de un jugador

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `player_id` | FK → PlayerProfile | — |
| `club_name` | String | Nombre del club (puede no estar en el sistema) |
| `club_id` | FK → ClubProfile | Nullable; si el club está en la plataforma |
| `season_from` | String | Temporada de inicio (ej: "2021/22") |
| `season_to` | String | Temporada de fin |
| `category` | Enum | Categoría en ese club |
| `verification_status` | Enum | `declared`, `verified` |
| `verified_by` | String | Fuente de verificación (null hasta COMET) |

---

### 8. `Tryout` — Convocatoria publicada por un club

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `club_id` | FK → ClubProfile | Club que publica |
| `title` | String | Título de la convocatoria |
| `description` | String | Descripción |
| `category` | Enum | Categoría buscada |
| `positions_needed` | Enum[] | Posiciones que busca |
| `age_min` | Int | Edad mínima |
| `age_max` | Int | Edad máxima |
| `date_tryout` | DateTime | Fecha del tryout |
| `location_zone` | String | Zona del tryout |
| `status` | Enum | `draft`, `published`, `closed`, `cancelled` |
| `applications_count` | Int | Número de aplicaciones |
| `created_at` | DateTime | — |
| `expires_at` | DateTime | Fecha de cierre |

---

### 9. `TryoutApplication` — Postulación de un jugador a un tryout

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `tryout_id` | FK → Tryout | — |
| `player_id` | FK → PlayerProfile | — |
| `status` | Enum | `pending`, `reviewed`, `selected`, `rejected`, `withdrawn` |
| `message` | String | Mensaje opcional del jugador |
| `applied_at` | DateTime | — |
| `updated_at` | DateTime | — |

---

### 10. `Match` — Compatibilidad calculada entre dos actores

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `actor_a_type` | Enum | Tipo del primer actor |
| `actor_a_id` | UUID | ID del primer actor |
| `actor_b_type` | Enum | Tipo del segundo actor |
| `actor_b_id` | UUID | ID del segundo actor |
| `score` | Float | Score de compatibilidad (0–100) |
| `score_breakdown` | JSON | Detalle por criterio |
| `status` | Enum | `suggested`, `viewed`, `contact_initiated`, `opted_in_a`, `opted_in_both`, `closed` |
| `created_at` | DateTime | — |
| `updated_at` | DateTime | — |

---

### 11. `ContactRequest` — Solicitud de contacto entre actores

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `match_id` | FK → Match | — |
| `initiator_id` | UUID | Quien inicia el contacto |
| `recipient_id` | UUID | Quien recibe |
| `status` | Enum | `pending`, `accepted`, `declined`, `expired` |
| `optin_initiator` | Boolean | — |
| `optin_recipient` | Boolean | — |
| `channel_enabled_at` | DateTime | Cuándo se habilitó el canal (ambos opt-in) |
| `created_at` | DateTime | — |

---

### 12. `Message` — Mensajes entre actores con canal habilitado

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `contact_request_id` | FK → ContactRequest | Solo si canal habilitado |
| `sender_id` | UUID | — |
| `recipient_id` | UUID | — |
| `content` | String | Contenido del mensaje |
| `moderated` | Boolean | Si fue revisado por moderación |
| `sent_at` | DateTime | — |

---

### 13. `Notification` — Notificaciones del sistema

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | Destinatario |
| `type` | Enum | Tipo de notificación |
| `title` | String | — |
| `body` | String | — |
| `read` | Boolean | — |
| `channel` | Enum | `push`, `email`, `in_app` |
| `sent_at` | DateTime | — |
| `read_at` | DateTime | — |

---

### 14. `ModerationLog` — Registro de acciones de moderación

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `content_type` | Enum | Qué tipo de contenido se moderó |
| `content_id` | UUID | ID del contenido |
| `action` | Enum | `approved`, `blocked`, `escalated` |
| `reason` | String | Motivo |
| `moderator_id` | UUID | Nullable si fue automático |
| `created_at` | DateTime | — |

---

### 15. `GeographicZone` — Zonas geográficas del sistema

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `name` | String | Nombre de la zona (ej: "Zona Norte Madrid") |
| `country` | String | — |
| `region` | String | Comunidad autónoma / estado |
| `city` | String | — |
| `polygon` | GeoJSON | Polígono de la zona (nunca punto exacto) |
| `club_density` | Int | Número de clubes en la zona |

---

### 16. `UserLocation` — Ubicación del usuario (ofuscada para menores)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | — |
| `zone_id` | FK → GeographicZone | Zona asignada |
| `exact_coords` | Point | **Almacenado cifrado. NUNCA expuesto si el usuario es menor.** |
| `precision_level` | Enum | `exact` (mayores), `zone` (menores) |
| `updated_at` | DateTime | — |

---

### 17. `ParentalConsent` — Registro de consentimiento parental

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `child_id` | FK → ChildProfile | — |
| `family_id` | FK → FamilyProfile | — |
| `consent_given` | Boolean | — |
| `consent_method` | Enum | `in_app`, `email_confirmation`, `document` |
| `ip_address` | String | IP desde donde se dio el consentimiento |
| `given_at` | DateTime | — |
| `revoked_at` | DateTime | Nullable; si se revocó |

---

### 18. `AgentLog` — Registro de acciones de agentes de producto

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `agent_name` | Enum | Qué agente actuó |
| `user_id` | UUID | Usuario afectado |
| `action` | String | Acción ejecutada |
| `input_data` | JSON | Datos de entrada |
| `output_data` | JSON | Datos de salida |
| `status` | Enum | `success`, `error`, `skipped` |
| `executed_at` | DateTime | — |

---

## Entidades Post-MVP (definidas, no implementar en MVP)

### 19. `ScoutProfile` — Perfil de Scout *(Post-MVP)*

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | — |
| `organization` | String | Club u organización para quien trabaja |
| `license` | String | Licencia de scouting (`declarado`) |
| `categories_interest` | Enum[] | Categorías de interés |
| `search_criteria` | JSON | Criterios de búsqueda activa |

---

### 20. `ProfessionalProfile` — Perfil de Profesional (Entrenador, Preparador, Fisio, Staff) *(Post-MVP)*

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | — |
| `user_id` | FK → User | — |
| `professional_type` | Enum | `coach`, `fitness_trainer`, `physiotherapist`, `staff`, `kit_manager` |
| `license` | String | Licencia/titulación (`declarado`) |
| `experience_years` | Int | — |
| `specialization` | String | — |
| `availability` | Enum | `full_time`, `part_time`, `freelance` |
| `location_zone` | String | — |

---

## Notas de implementación

- **Estado de verificación:** Todos los campos federativos (`federation_id`, `license`, historial de clubes) arrancan como `declared`. Se actualizarán a `verified` solo cuando COMET esté integrado.
- **Coordenadas de menores:** El campo `exact_coords` en `UserLocation` se almacena cifrado y **NUNCA se expone** en API responses cuando `precision_level = zone`.
- **Orden de implementación sugerido:** User → FamilyProfile + ChildProfile + ParentalConsent → ClubProfile + AcademyProfile → PlayerProfile + ClubHistory → Tryout → Match → ContactRequest.
