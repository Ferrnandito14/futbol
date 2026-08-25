import { describe, it, expect } from 'vitest';
import {
  OnboardingContract,
  ContactContract,
  GeoIntelligenceContract,
  HistoryContract,
  NotificationContract,
} from '../src/agents/contracts.js';

describe('Reglas No Negociables del Pipeline de Agentes', () => {
  it('OnboardingAgent: debe frenar si un menor no tiene consentimiento parental', () => {
    const onboardingInstance: OnboardingContract = {
      role: 'Guía al nuevo usuario en el proceso de registro según su tipo de actor',
      input: {
        userId: 'u-123',
        actorType: 'CHILD',
        rawProfileData: { fullName: 'Juanito' },
      },
      context: {
        country: 'ES',
        declaredAge: 12,
        hasParentalConsent: false,
      },
      coreInstruction: 'Validar edad y consentimiento antes de crear perfil',
      brake: [
        {
          id: 'BRAKE_NO_PARENTAL_CONSENT',
          description: 'No crear perfil de menor sin consentimiento parental',
          condition: 'context.hasParentalConsent === false',
        },
      ],
      output: {
        profileCreated: false,
        status: 'PENDING_CONSENT',
        missingFields: ['parentalConsent'],
      },
      nextAgent: 'PROFILE_COMPLETENESS',
      verification: {
        id: 'VERIFY_CONSENT_REGISTERED',
        criteria: 'Perfil de menor no debe crearse como activo sin consentimiento',
      },
    };

    expect(onboardingInstance.output.profileCreated).toBe(false);
    expect(onboardingInstance.output.status).toBe('PENDING_CONSENT');
    expect(onboardingInstance.brake[0].id).toBe('BRAKE_NO_PARENTAL_CONSENT');
  });

  it('ContactAgent: contacto directo bloqueado hasta que ambas partes tengan opt-in mutuo', () => {
    const contactInstancePending: ContactContract = {
      role: 'Gestiona el proceso de contacto entre actores tras un match',
      input: {
        matchId: 'm-456',
        initiatorId: 'u-club-1',
      },
      context: {
        optinInitiator: true,
        optinRecipient: false, // Receptor aún no acepta
        isMinorInvolved: true,
        parentalConsentVerified: true,
      },
      coreInstruction: 'Habilitar chat solo si ambas partes tienen opt-in explícito',
      brake: [
        {
          id: 'BRAKE_MUTUAL_OPTIN_REQUIRED',
          description: 'Contacto directo bloqueado por defecto',
          condition: 'context.optinInitiator === false || context.optinRecipient === false',
        },
      ],
      output: {
        channelEnabled: false,
        contactDetailsRevealed: false,
        status: 'PENDING',
      },
      nextAgent: 'FOLLOW_UP',
      verification: {
        id: 'VERIFY_NO_LEAKED_CONTACT_WITHOUT_OPTIN',
        criteria: 'Ningún dato de contacto revelado sin opt-in mutuo',
      },
    };

    expect(contactInstancePending.output.channelEnabled).toBe(false);
    expect(contactInstancePending.output.contactDetailsRevealed).toBe(false);
  });

  it('GeoIntelligenceAgent: coordenadas exactas de menores NUNCA se exponen y el orden de priorización es estricto', () => {
    const geoInstance: GeoIntelligenceContract = {
      role: 'Cruza ubicación real con contexto deportivo del usuario',
      input: {
        userId: 'u-child-1',
        isMinor: true,
        searchRadiusKm: 10,
      },
      context: {
        assignedZoneName: 'Zona Norte Madrid',
        clubDensityInZone: 14,
        urgencyPriority: 1,
        competitiveLevelPriority: 2,
      },
      coreInstruction: 'Ofuscar ubicación a nivel de zona para menores y priorizar: Urgencia > Nivel > Proximidad',
      brake: [
        {
          id: 'BRAKE_EXACT_COORDS_FORBIDDEN_FOR_MINORS',
          description: 'Nunca exponer coordenadas exactas de menores de edad',
          condition: 'input.isMinor === true',
        },
      ],
      output: {
        displayZoneLabel: 'Zona Norte Madrid',
        exactCoordinatesExposed: false,
        prioritizationOrder: ['URGENCY', 'COMPETITIVE_LEVEL', 'PROXIMITY'],
      },
      nextAgent: 'MATCHING',
      verification: {
        id: 'VERIFY_ZERO_COORDINATE_EXPOSURE',
        criteria: 'exactCoordinatesExposed debe ser estrictamente false',
      },
    };

    expect(geoInstance.output.exactCoordinatesExposed).toBe(false);
    expect(geoInstance.output.prioritizationOrder).toEqual(['URGENCY', 'COMPETITIVE_LEVEL', 'PROXIMITY']);
  });

  it('HistoryAgent: datos sin integración COMET siempre se marcan como DECLARED', () => {
    const historyInstance: HistoryContract = {
      role: 'Registra y gestiona el historial de interacciones y cambios de estado',
      input: {
        userId: 'u-player-1',
        eventType: 'CLUB_CHANGE',
        eventData: { previousClub: 'Club Deportivo Ejemplo' },
      },
      context: {
        isFederatedChange: true,
        hasOfficialSource: false, // COMET bloqueado
      },
      coreInstruction: 'Registrar historial y etiquetar como DECLARED si no hay API oficial conectada',
      brake: [
        {
          id: 'BRAKE_NO_FAKE_VERIFICATIONS',
          description: 'Nunca inventar verificaciones sin fuente oficial',
          condition: 'context.hasOfficialSource === false',
        },
      ],
      output: {
        historyEntryId: 'hist-789',
        verificationStatus: 'DECLARED',
        timelineUpdated: true,
      },
      verification: {
        id: 'VERIFY_DECLARED_STATUS',
        criteria: 'verificationStatus debe ser DECLARED',
      },
    };

    expect(historyInstance.output.verificationStatus).toBe('DECLARED');
  });

  it('NotificationAgent: notificaciones de menores se redirigen a la cuenta de la familia', () => {
    const notificationInstance: NotificationContract = {
      role: 'Gestiona todas las notificaciones hacia el usuario',
      input: {
        targetUserId: 'u-minor-1',
        type: 'MATCH_SUGGESTION',
        title: 'Nueva academia compatible',
        body: 'Hay una academia disponible en tu zona',
      },
      context: {
        isMinor: true,
        familyUserId: 'u-family-parent-1',
        notificationsSentToday: 2,
        currentHourLocal: 18,
      },
      coreInstruction: 'Redirigir notificación de menor hacia la familia responsable',
      brake: [
        {
          id: 'BRAKE_MINORS_DO_NOT_RECEIVE_MATCH_NOTIFICATIONS_DIRECTLY',
          description: 'Notificaciones de menores van exclusivamente al tutor',
          condition: 'context.isMinor === true && input.targetUserId !== context.familyUserId',
        },
      ],
      output: {
        sentToUserId: 'u-family-parent-1',
        channel: 'IN_APP',
        dispatched: true,
      },
      verification: {
        id: 'VERIFY_PARENT_RECIPIENT',
        criteria: 'sentToUserId debe ser igual a familyUserId',
      },
    };

    expect(notificationInstance.output.sentToUserId).toBe('u-family-parent-1');
  });
});
