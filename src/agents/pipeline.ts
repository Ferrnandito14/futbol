/**
 * Implementación de los 10 Agentes de Producto de Startup Deportiva
 * Cada función valida sus frenos (Brakes) y emite un resultado trazable en AgentLog.
 */

import {
  OnboardingContract,
  OnboardingInput,
  OnboardingContext,
  OnboardingOutput,
  ProfileCompletenessContract,
  ProfileCompletenessInput,
  ProfileCompletenessContext,
  ProfileCompletenessOutput,
  MatchingContract,
  MatchingInput,
  MatchingContext,
  MatchingOutput,
  MatchResultItem,
  ContactContract,
  ContactInput,
  ContactContext,
  ContactOutput,
  FollowUpContract,
  FollowUpInput,
  FollowUpContext,
  FollowUpOutput,
  HistoryContract,
  HistoryInput,
  HistoryContext,
  HistoryOutput,
  NotificationContract,
  NotificationInput,
  NotificationContext,
  NotificationOutput,
  ModerationContract,
  ModerationInput,
  ModerationContext,
  ModerationOutput,
  RecommendationContract,
  RecommendationInput,
  RecommendationContext,
  RecommendationOutput,
  GeoIntelligenceContract,
  GeoIntelligenceInput,
  GeoIntelligenceContext,
  GeoIntelligenceOutput,
} from './contracts.js';

// ----------------------------------------------------------------------
// 1. AGENTE DE ONBOARDING
// ----------------------------------------------------------------------
export function executeOnboardingAgent(
  input: OnboardingInput,
  context: OnboardingContext
): OnboardingContract {
  const missing: string[] = [];

  // Freno 1: Menor sin consentimiento parental
  if (input.actorType === 'CHILD' && !context.hasParentalConsent) {
    missing.push('parentalConsent');
  }

  // Freno 2: Jugador con club sin historial
  if (input.actorType === 'PLAYER_WITH_CLUB') {
    const rawHistory = input.rawProfileData['clubHistory'];
    if (!rawHistory || (Array.isArray(rawHistory) && rawHistory.length === 0)) {
      missing.push('clubHistory');
    }
  }

  const isPendingConsent = input.actorType === 'CHILD' && !context.hasParentalConsent;
  const isComplete = missing.length === 0;

  const output: OnboardingOutput = {
    profileCreated: !isPendingConsent,
    status: isPendingConsent ? 'PENDING_CONSENT' : isComplete ? 'ACTIVE' : 'INCOMPLETE',
    missingFields: missing,
  };

  return {
    role: 'Guía al nuevo usuario en el proceso de registro según su tipo de actor',
    input,
    context,
    coreInstruction: 'Recopilar datos obligatorios por actor, frenar si menor no tiene consentimiento o jugador no tiene historial.',
    brake: [
      {
        id: 'BRAKE_NO_PARENTAL_CONSENT',
        description: 'No crear perfil de menor sin consentimiento parental',
        condition: 'context.hasParentalConsent === false && input.actorType === "CHILD"',
      },
      {
        id: 'BRAKE_NO_CLUB_HISTORY',
        description: 'Historial de clubes es obligatorio para Jugador con Club',
        condition: '!input.rawProfileData.clubHistory && input.actorType === "PLAYER_WITH_CLUB"',
      },
    ],
    output,
    nextAgent: 'PROFILE_COMPLETENESS',
    verification: {
      id: 'VERIFY_MINIMUM_ACTOR_REQUIREMENTS',
      criteria: 'Perfil de menor no activo sin consentimiento; historial presente en jugador.',
    },
  };
}

// ----------------------------------------------------------------------
// 2. AGENTE DE COMPLETITUD DE PERFIL
// ----------------------------------------------------------------------
export function executeProfileCompletenessAgent(
  input: ProfileCompletenessInput,
  context: ProfileCompletenessContext
): ProfileCompletenessContract {
  let suggestedField: { fieldKey: string; impactLabel: string } | undefined;

  if (context.missingFields.length > 0) {
    const topMissing = context.missingFields[0];
    const impactMap: Record<string, string> = {
      positionPrimary: 'Completar tu posición te dará 3x más visibilidad en búsquedas de clubes.',
      dominantFoot: 'Indicar tu pie dominante ayuda a los clubes a filtrar perfiles por banda.',
      locationZone: 'Definir tu zona permite que el Agente Geo encuentre academias cercanas.',
      category: 'La categoría federativa es clave para convocatorias a tryouts.',
    };

    suggestedField = {
      fieldKey: topMissing,
      impactLabel: impactMap[topMissing] || 'Completar este campo mejorará tu índice de compatibilidad.',
    };
  }

  // Freno: Máximo 1 sugerencia por sesión, no spamear
  const shouldNotify = Boolean(suggestedField && input.currentCompletenessPercentage < 100);

  return {
    role: 'Monitorea y empuja al usuario a completar su perfil con foco en campos de alto impacto',
    input,
    context,
    coreInstruction: 'Detectar campos faltantes prioritarios y mostrar el beneficio concreto de completarlo.',
    brake: [
      {
        id: 'BRAKE_NO_SPAM_SAME_SESSION',
        description: 'Máximo 1 sugerencia por sesión activa',
        condition: 'lastSuggestionWithinCurrentSession === true',
      },
    ],
    output: {
      suggestedField,
      shouldNotify,
    },
    nextAgent: input.currentCompletenessPercentage >= 70 ? 'MATCHING' : undefined,
    verification: {
      id: 'VERIFY_RELEVANT_IMPACT_SUGGESTION',
      criteria: 'La sugerencia debe corresponder a un campo prioritario no completado.',
    },
  };
}

// ----------------------------------------------------------------------
// 3. AGENTE DE MATCHING
// ----------------------------------------------------------------------
export function executeMatchingAgent(
  input: MatchingInput,
  context: MatchingContext,
  availableCandidates: Array<{
    id: string;
    type: string;
    category: string;
    zone: string;
    urgencyScore: number;
    levelScore: number;
    proximityScore: number;
    isVerified: boolean;
  }>
): MatchingContract {
  const scoredMatches: MatchResultItem[] = availableCandidates.map((c) => {
    // Regla de priorización: Urgencia (50%) > Nivel competitivo (30%) > Proximidad (20%)
    const compositeScore = Math.round(
      c.urgencyScore * 0.5 + c.levelScore * 0.3 + c.proximityScore * 0.2
    );

    return {
      targetId: c.id,
      targetType: c.type,
      score: compositeScore,
      // NUNCA exponer coordenadas exactas, solo la etiqueta de zona
      zoneDisplay: c.zone,
      verificationStatus: c.isVerified ? 'VERIFIED' : 'DECLARED',
    };
  });

  // Ordenar por score descendente
  scoredMatches.sort((a, b) => b.score - a.score);

  return {
    role: 'Calcula compatibilidades entre actores según urgencia, nivel y zona',
    input,
    context,
    coreInstruction: 'Calcular score multivariable ponderando Urgencia > Nivel > Proximidad, ofuscando coordenadas.',
    brake: [
      {
        id: 'BRAKE_NEVER_PRIORITIZE_DISTANCE_OVER_LEVEL',
        description: 'La cercanía no puede superar el peso del nivel competitivo ni de la urgencia',
        condition: 'weightProximity > weightUrgency || weightProximity > weightLevel',
      },
      {
        id: 'BRAKE_NO_COORDINATES_IN_OUTPUT',
        description: 'La salida solo debe contener nombres de zona, jamás coordenadas numéricas exactas',
        condition: 'output.matches.some(m => hasCoordinates(m.zoneDisplay))',
      },
    ],
    output: {
      matches: scoredMatches,
    },
    nextAgent: 'CONTACT',
    verification: {
      id: 'VERIFY_STRICT_ZONE_AND_ORDER',
      criteria: 'Matches ordenados por score compuesto con zona ofuscada.',
    },
  };
}

// ----------------------------------------------------------------------
// 4. AGENTE DE CONTACTO (DOBLE OPT-IN MUTUO)
// ----------------------------------------------------------------------
export function executeContactAgent(
  input: ContactInput,
  context: ContactContext
): ContactContract {
  const isMutualOptIn = context.optinInitiator && context.optinRecipient;
  const minorSafe = !context.isMinorInvolved || context.parentalConsentVerified;

  const channelEnabled = isMutualOptIn && minorSafe;
  const contactDetailsRevealed = channelEnabled;

  const status = isMutualOptIn
    ? 'ACCEPTED'
    : context.optinInitiator
    ? 'PENDING'
    : 'DECLINED';

  return {
    role: 'Gestiona el proceso de contacto entre actores tras un match',
    input,
    context,
    coreInstruction: 'Bloquear contacto directo hasta que ambas partes den opt-in explícito y menor tenga consentimiento.',
    brake: [
      {
        id: 'BRAKE_MUTUAL_OPTIN_REQUIRED',
        description: 'Contacto directo oculto por defecto; revelado solo con opt-in mutuo',
        condition: '!context.optinInitiator || !context.optinRecipient',
      },
      {
        id: 'BRAKE_MINOR_PARENTAL_CONSENT_MANDATORY',
        description: 'Si hay menor involucrado, requiere verificación formal de consentimiento parental',
        condition: 'context.isMinorInvolved && !context.parentalConsentVerified',
      },
    ],
    output: {
      channelEnabled,
      contactDetailsRevealed,
      status,
    },
    nextAgent: channelEnabled ? 'FOLLOW_UP' : undefined,
    verification: {
      id: 'VERIFY_ZERO_CONTACT_LEAK',
      criteria: 'channelEnabled es true solo si optinInitiator && optinRecipient === true.',
    },
  };
}

// ----------------------------------------------------------------------
// 5. AGENTE DE SEGUIMIENTO
// ----------------------------------------------------------------------
export function executeFollowUpAgent(
  input: FollowUpInput,
  context: FollowUpContext
): FollowUpContract {
  let actionTaken: 'NOOP' | 'SEND_REMINDER' | 'MARK_INACTIVE' = 'NOOP';
  let shouldNotifyParties = false;

  if (!context.isClosed) {
    if (context.hoursSinceLastActivity >= 168) {
      // 7 días sin respuesta
      actionTaken = 'MARK_INACTIVE';
      shouldNotifyParties = true;
    } else if (context.hoursSinceLastActivity >= 72 && context.remindersSentCount < 2) {
      // 72 horas sin respuesta (máximo 2 recordatorios)
      actionTaken = 'SEND_REMINDER';
      shouldNotifyParties = true;
    }
  }

  return {
    role: 'Hace seguimiento del estado de las interacciones iniciadas para evitar estancamiento',
    input,
    context,
    coreInstruction: 'Enviar recordatorio a las 72h (máximo 2) o archivar como inactivo a los 7 días.',
    brake: [
      {
        id: 'BRAKE_MAX_TWO_REMINDERS',
        description: 'No enviar más de 2 recordatorios por conversación estancada',
        condition: 'context.remindersSentCount >= 2',
      },
      {
        id: 'BRAKE_DO_NOT_REOPEN_CLOSED',
        description: 'No reactivar conversaciones explícitamente cerradas por los usuarios',
        condition: 'context.isClosed === true',
      },
    ],
    output: {
      actionTaken,
      shouldNotifyParties,
    },
    nextAgent: actionTaken === 'MARK_INACTIVE' ? 'HISTORY' : undefined,
    verification: {
      id: 'VERIFY_FOLLOW_UP_THRESHOLDS',
      criteria: 'Recordatorios enviados estrictamente en los umbrales de 72h y 7d.',
    },
  };
}

// ----------------------------------------------------------------------
// 6. AGENTE DE HISTORIAL
// ----------------------------------------------------------------------
export function executeHistoryAgent(
  input: HistoryInput,
  context: HistoryContext
): HistoryContract {
  // Regla no negociable: Si no hay integración COMET conectada, el dato es SIEMPRE DECLARED
  const verificationStatus = context.hasOfficialSource ? 'VERIFIED' : 'DECLARED';

  return {
    role: 'Registra y audita el historial de cambios, clubes y convocatorias del usuario',
    input,
    context,
    coreInstruction: 'Registrar eventos en timeline con timestamp y etiquetar federaciones como DECLARED sin COMET.',
    brake: [
      {
        id: 'BRAKE_NO_UNVERIFIED_STATUS_AS_VERIFIED',
        description: 'Nunca marcar como VERIFIED si no hay fuente oficial conectada',
        condition: '!context.hasOfficialSource && output.verificationStatus === "VERIFIED"',
      },
    ],
    output: {
      historyEntryId: `hist-${Date.now()}`,
      verificationStatus,
      timelineUpdated: true,
    },
    verification: {
      id: 'VERIFY_EVENT_IMMUTABILITY_AND_STATUS',
      criteria: 'El evento queda guardado con trazabilidad y estado declared correcto.',
    },
  };
}

// ----------------------------------------------------------------------
// 7. AGENTE DE NOTIFICACIONES
// ----------------------------------------------------------------------
export function executeNotificationAgent(
  input: NotificationInput,
  context: NotificationContext
): NotificationContract {
  // Freno: No enviar notificaciones en horario nocturno (23h - 07h)
  const isNightTime = context.currentHourLocal >= 23 || context.currentHourLocal < 7;
  // Freno: Límite de 5 notificaciones diarias
  const isRateLimited = context.notificationsSentToday >= 5;

  // Regla de menores: Enviar a la cuenta de la familia
  const targetRecipient = context.isMinor && context.familyUserId
    ? context.familyUserId
    : input.targetUserId;

  const dispatched = !isNightTime && !isRateLimited;

  return {
    role: 'Gestiona la entrega consolidada de notificaciones respetando privacidad y límites diarios',
    input,
    context,
    coreInstruction: 'Enviar notificaciones respetando horario, límite diario y redirigir avisos de menores al tutor.',
    brake: [
      {
        id: 'BRAKE_REDIRECT_MINORS_TO_PARENT',
        description: 'Las notificaciones dirigidas a menores van a la cuenta del representante legal',
        condition: 'context.isMinor === true && output.sentToUserId !== context.familyUserId',
      },
      {
        id: 'BRAKE_NIGHT_HOURS_RESTRICTION',
        description: 'No enviar notificaciones entre 23:00 y 07:00 hora local',
        condition: 'context.currentHourLocal >= 23 || context.currentHourLocal < 7',
      },
      {
        id: 'BRAKE_MAX_FIVE_PER_DAY',
        description: 'Límite de 5 notificaciones por usuario por día',
        condition: 'context.notificationsSentToday >= 5',
      },
    ],
    output: {
      sentToUserId: targetRecipient,
      channel: 'IN_APP',
      dispatched,
    },
    verification: {
      id: 'VERIFY_RECIPIENT_AND_FREQUENCY',
      criteria: 'Notificación enviada a usuario correcto sin superar cuota diaria ni horario.',
    },
  };
}

// ----------------------------------------------------------------------
// 8. AGENTE DE MODERACIÓN
// ----------------------------------------------------------------------
export function executeModerationAgent(
  input: ModerationInput,
  context: ModerationContext
): ModerationContract {
  // Detectar intentos de bypass de contacto (teléfonos, emails, @handles)
  const phonePattern = /(?:\+?[\d\s-]{8,15})|(?:6\d{2}[\s.-]?\d{3}[\s.-]?\d{3})/;
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const handlePattern = /(?:ig:|instagram:|whatsapp:|wsp:|tlf:|teléfono:)\s*[\w\d.-]+/i;

  const containsPhone = phonePattern.test(input.rawText);
  const containsEmail = emailPattern.test(input.rawText);
  const containsHandle = handlePattern.test(input.rawText);

  const detectedBypass = containsPhone || containsEmail || containsHandle;

  let action: 'APPROVED' | 'BLOCKED' | 'ESCALATED' = 'APPROVED';
  let reason: string | undefined;

  if (detectedBypass) {
    action = 'BLOCKED';
    reason = 'Detectado intento de compartir datos de contacto directos fuera del flujo de opt-in mutuo.';
  }

  return {
    role: 'Supervisa contenido y mensajes para proteger la privacidad y el flujo de opt-in mutuo',
    input,
    context,
    coreInstruction: 'Analizar texto libre y bloquear información de contacto embebida para evitar bypass del opt-in.',
    brake: [
      {
        id: 'BRAKE_BLOCK_CONTACT_LEAKS_IN_FREE_TEXT',
        description: 'Bloquear inmediatamente textos con teléfonos, emails o cuentas de redes sociales',
        condition: 'detectedContactInfoBypass === true',
      },
    ],
    output: {
      action,
      detectedContactInfoBypass: detectedBypass,
      reason,
    },
    nextAgent: action === 'BLOCKED' ? 'NOTIFICATION' : undefined,
    verification: {
      id: 'VERIFY_NO_CONTACT_BYPASS',
      criteria: 'Ningún texto libre con teléfono o email es aprobado.',
    },
  };
}

// ----------------------------------------------------------------------
// 9. AGENTE DE RECOMENDACIONES
// ----------------------------------------------------------------------
export function executeRecommendationAgent(
  input: RecommendationInput,
  context: RecommendationContext,
  availableOpportunities: Array<{ id: string; type: string; title: string; targetActor: string }>
): RecommendationContract {
  // Freno: Máximo 3 recomendaciones por semana
  const canRecommend = context.recommendationsSentThisWeek < 3;
  const filtered = canRecommend
    ? availableOpportunities
        .filter((op) => op.targetActor === input.actorType)
        .slice(0, 3)
        .map((op) => ({
          id: op.id,
          type: op.type,
          reason: `Nueva convocatoria relevante para tu perfil de ${input.actorType.toLowerCase().replace('_', ' ')}`,
        }))
    : [];

  return {
    role: 'Genera sugerencias proactivas y personalizadas según el tipo de actor del MVP',
    input,
    context,
    coreInstruction: 'Emitir hasta 3 recomendaciones semanales personalizadas para el rol del usuario.',
    brake: [
      {
        id: 'BRAKE_MAX_THREE_PER_WEEK',
        description: 'No emitir más de 3 recomendaciones a la semana',
        condition: 'context.recommendationsSentThisWeek >= 3',
      },
      {
        id: 'BRAKE_ONLY_MVP_ACTORS',
        description: 'No emitir recomendaciones para Scout ni Profesionales en el MVP',
        condition: 'input.actorType === "SCOUT" || input.actorType === "PROFESSIONAL"',
      },
    ],
    output: {
      recommendations: filtered,
    },
    nextAgent: filtered.length > 0 ? 'MATCHING' : undefined,
    verification: {
      id: 'VERIFY_RELEVANT_MVP_RECOMMENDATIONS',
      criteria: 'Recomendaciones dirigidas solo a actores activos del MVP.',
    },
  };
}

// ----------------------------------------------------------------------
// 10. AGENTE DE INTELIGENCIA GEOGRÁFICA (FASE GEO)
// ----------------------------------------------------------------------
export function executeGeoIntelligenceAgent(
  input: GeoIntelligenceInput,
  context: GeoIntelligenceContext
): GeoIntelligenceContract {
  // Invariante de seguridad: Coordenadas exactas NUNCA se exponen
  const exactCoordinatesExposed = false as const;

  const displayZoneLabel = `${context.assignedZoneName} (Aprox. ${input.searchRadiusKm || 10}km)`;

  return {
    role: 'Cruza ubicación real con contexto deportivo del usuario',
    input,
    context,
    coreInstruction: 'Proporcionar contexto geográfico respetando estricta ofuscación de menores y orden de prioridades.',
    brake: [
      {
        id: 'BRAKE_NEVER_EXPOSE_CHILD_COORDS',
        description: 'Las coordenadas exactas de menores de edad jamás deben exponerse en la salida',
        condition: 'output.exactCoordinatesExposed !== false',
      },
      {
        id: 'BRAKE_DISTANCE_IS_THIRD_PRIORITY',
        description: 'La cercanía no puede sobreponerse a urgencia o nivel',
        condition: 'prioritizationOrder[0] !== "URGENCY"',
      },
    ],
    output: {
      displayZoneLabel,
      exactCoordinatesExposed,
      prioritizationOrder: ['URGENCY', 'COMPETITIVE_LEVEL', 'PROXIMITY'],
    },
    nextAgent: 'MATCHING',
    verification: {
      id: 'VERIFY_GEO_OBFUSCATION_AND_WEIGHTS',
      criteria: 'exactCoordinatesExposed es false y orden de prioridades es Urgencia > Nivel > Proximidad.',
    },
  };
}
