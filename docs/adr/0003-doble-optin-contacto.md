# ADR 0003 — Modelo de Contacto Seguro y Doble Opt-in Mutuo

## Estado
Aceptado (Regla No Negociable)

## Contexto
El contacto no solicitado entre clubes y familias/jugadores genera fricción, intermediación no regulada y vulnera la privacidad. Un match de compatibilidad no debe desencadenar la revelación automática de correos o teléfonos.

## Decisión
1. **Ocultamiento por Defecto:** Todos los correos electrónicos y teléfonos se mantienen ocultos en perfiles públicos.
2. **Doble Opt-in Mutuo:** Un canal de comunicación solo se abre cuando:
   - El iniciador envía una postulación o solicitud de contacto (`optin_initiator = true`).
   - El receptor revisa el perfil deportivo y acepta explícitamente (`optin_recipient = true`).
3. **Filtro de Moderación:** El Agente de Moderación (`ModerationAgent`) escanea automáticamente textos libres en mensajes y descripciones para bloquear teléfonos, enlaces o handles sociales destinados a evadir el opt-in mutuo.

## Consecuencias
- Interacciones consensuadas de alta calidad.
- Protección total de datos personales en etapas de prospección.
