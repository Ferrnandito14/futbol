# ADR 0004 — Política de Verificación de Datos Federativos y Estado COMET

## Estado
Aceptado (Regla No Negociable)

## Contexto
El sistema oficial de licencias y fichas federativas (ej. COMET de la FIFA/RFEF) requiere acuerdos de acceso federativo externos actualmente no disponibles. La plataforma no debe atribuirse verificaciones falsas.

## Decisión
1. **Etiquetado Exclusivo "Declarado":** Todos los historiales de clubes de jugadores (`ClubHistory`), licencias de clubes (`ClubProfile`) y categorías registradas se marcan en la base de datos y en la interfaz como `DECLARED` (Declarado).
2. **Prohibición de "Verificado" sin Fuente Oficial:** Ningún agente ni usuario puede cambiar el estado a `VERIFIED` sin que exista un conector oficial automatizado o validación documental formal registrada en auditoría.
3. **Historial Obligatorio:** El historial deportivo de clubes es un campo obligatorio e ineludible para el actor "Jugador con club".

## Consecuencias
- Transparencia y confianza en los datos deportivos presentados a clubes y familias.
- Cumplimiento estricto del roadmap y preparación limpia para la fase de integración con COMET.
