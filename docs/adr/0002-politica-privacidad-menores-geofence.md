# ADR 0002 — Política de Privacidad de Menores y Ofuscación Geográfica

## Estado
Aceptado (Regla No Negociable)

## Contexto
El fútbol formativo involucra a niños y jóvenes menores de edad. Exponer la ubicación exacta o el contacto de un menor compromete severamente la seguridad física y digital de los usuarios y viola regulaciones de protección al menor (RGPD / COPPA).

## Decisión
1. **Ofuscación Geográfica Estricta:** Las coordenadas exactas (`exact_coords_enc`) solo se almacenan cifradas con AES-256 para propósitos de cálculo interno. Las APIs públicas y respuestas de matching solo devuelven nombres de zonas poligonales o radios aproximados (mínimo 1km).
2. **Consentimiento Parental Obligatorio:** Ningún perfil de menor (`ChildProfile`) puede activarse o ser visible sin el registro de consentimiento de su tutor en `ParentalConsent` (incluyendo IP y fecha de aceptación).
3. **Canal de Notificaciones Exclusivo para Tutores:** Las notificaciones de interés o convocatorias para menores se dirigen obligatoriamente a la cuenta de la familia (`FamilyProfile`).

## Consecuencias
- Riesgo cero de filtración de coordenadas exactas de menores.
- Auditoría legal completa ante cualquier solicitud de acceso a datos.
