/**
 * Contratos Fuertemente Tipados para el Pipeline de Agentes de Producto
 * 
 * Cada agente implementa estrictamente los 8 campos obligatorios:
 * 1. Rol (role)
 * 2. Entrada (input)
 * 3. Contexto/Datos (context)
 * 4. Instrucción Core (coreInstruction)
 * 5. Freno (brake)
 * 6. Salida (output)
 * 7. Siguiente agente (nextAgent)
 * 8. Verificación (verification)
 */

export type AgentName =
  | 'ONBOARDING'
  | 'PROFILE_COMPLETENESS'
  | 'MATCHING'
  | 'CONTACT'
  | 'FOLLOW_UP'
  | 'HISTORY'
  | 'NOTIFICATION'
  | 'MODERATION'
  | 'RECOMMENDATION'
  | 'GEO_INTELLIGENCE';

export interface AgentBrakeRule {
  id: string;
  description: string;
  condition: string;
}

export interface AgentVerificationRule {
  id: string;
  criteria: string;
  validatorFnName?: string;
}

export interface AgentContract<TInput, TContext, TOutput> {
  role: string;
  input: TInput;
  context: TContext;
  coreInstruction: string;
  brake: AgentBrakeRule[];
  output: TOutput;
  nextAgent?: AgentName;
  verification: AgentVerificationRule;
}

// ----------------------------------------------------------------------
// 1. Agente de Onboarding
// ----------------------------------------------------------------------
export interface OnboardingInput {
  userId: string;
  actorType: 'PLAYER_WITH_CLUB' | 'CHILD' | 'FAMILY' | 'CLUB' | 'ACADEMY';
  rawProfileData: Record<string, unknown>;
}

export interface OnboardingContext {
  country: string;
  declaredAge?: number;
  hasParentalConsent?: boolean;
}

export interface OnboardingOutput {
  profileCreated: boolean;
  status: 'INCOMPLETE' | 'ACTIVE' | 'PENDING_CONSENT';
  missingFields: string[];
}

export type OnboardingContract = AgentContract<OnboardingInput, OnboardingContext, OnboardingOutput>;

// ----------------------------------------------------------------------
// 2. Agente de Completitud de Perfil
// ----------------------------------------------------------------------
export interface ProfileCompletenessInput {
  userId: string;
  currentCompletenessPercentage: number;
}

export interface ProfileCompletenessContext {
  missingFields: string[];
  lastSuggestionDate?: Date;
  actorType: string;
}

export interface ProfileCompletenessOutput {
  suggestedField?: {
    fieldKey: string;
    impactLabel: string;
  };
  shouldNotify: boolean;
}

export type ProfileCompletenessContract = AgentContract<
  ProfileCompletenessInput,
  ProfileCompletenessContext,
  ProfileCompletenessOutput
>;

// ----------------------------------------------------------------------
// 3. Agente de Matching
// ----------------------------------------------------------------------
export interface MatchingInput {
  requesterId: string;
  requesterType: 'PLAYER_WITH_CLUB' | 'CHILD' | 'FAMILY' | 'CLUB' | 'ACADEMY';
  targetCategory?: string;
}

export interface MatchingContext {
  locationZone: string;
  urgencyLevel: number;
  competitiveLevel: string;
  isMinor: boolean;
}

export interface MatchResultItem {
  targetId: string;
  targetType: string;
  score: number;
  zoneDisplay: string; // NUNCA coordenadas exactas
  verificationStatus: 'DECLARED' | 'VERIFIED';
}

export interface MatchingOutput {
  matches: MatchResultItem[];
}

export type MatchingContract = AgentContract<MatchingInput, MatchingContext, MatchingOutput>;

// ----------------------------------------------------------------------
// 4. Agente de Contacto (Doble Opt-in Mutuo)
// ----------------------------------------------------------------------
export interface ContactInput {
  matchId: string;
  initiatorId: string;
}

export interface ContactContext {
  optinInitiator: boolean;
  optinRecipient: boolean;
  isMinorInvolved: boolean;
  parentalConsentVerified: boolean;
}

export interface ContactOutput {
  channelEnabled: boolean;
  contactDetailsRevealed: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export type ContactContract = AgentContract<ContactInput, ContactContext, ContactOutput>;

// ----------------------------------------------------------------------
// 5. Agente de Seguimiento
// ----------------------------------------------------------------------
export interface FollowUpInput {
  contactRequestId: string;
  lastMessageDate?: Date;
}

export interface FollowUpContext {
  hoursSinceLastActivity: number;
  remindersSentCount: number;
  isClosed: boolean;
}

export interface FollowUpOutput {
  actionTaken: 'NOOP' | 'SEND_REMINDER' | 'MARK_INACTIVE';
  shouldNotifyParties: boolean;
}

export type FollowUpContract = AgentContract<FollowUpInput, FollowUpContext, FollowUpOutput>;

// ----------------------------------------------------------------------
// 6. Agente de Historial
// ----------------------------------------------------------------------
export interface HistoryInput {
  userId: string;
  eventType: 'CLUB_CHANGE' | 'TRYOUT_APPLIED' | 'CONTACT_ESTABLISHED' | 'PROFILE_UPDATED';
  eventData: Record<string, unknown>;
}

export interface HistoryContext {
  isFederatedChange: boolean;
  hasOfficialSource: boolean;
}

export interface HistoryOutput {
  historyEntryId: string;
  verificationStatus: 'DECLARED' | 'VERIFIED';
  timelineUpdated: boolean;
}

export type HistoryContract = AgentContract<HistoryInput, HistoryContext, HistoryOutput>;

// ----------------------------------------------------------------------
// 7. Agente de Notificaciones
// ----------------------------------------------------------------------
export interface NotificationInput {
  targetUserId: string;
  type: string;
  title: string;
  body: string;
}

export interface NotificationContext {
  isMinor: boolean;
  familyUserId?: string;
  notificationsSentToday: number;
  currentHourLocal: number;
}

export interface NotificationOutput {
  sentToUserId: string; // Si es menor, se redirige a familyUserId
  channel: 'PUSH' | 'EMAIL' | 'IN_APP';
  dispatched: boolean;
}

export type NotificationContract = AgentContract<NotificationInput, NotificationContext, NotificationOutput>;

// ----------------------------------------------------------------------
// 8. Agente de Moderación
// ----------------------------------------------------------------------
export interface ModerationInput {
  contentType: 'PROFILE_TEXT' | 'MESSAGE' | 'TRYOUT_DESCRIPTION';
  rawText: string;
  authorId: string;
}

export interface ModerationContext {
  authorReputationScore: number;
}

export interface ModerationOutput {
  action: 'APPROVED' | 'BLOCKED' | 'ESCALATED';
  detectedContactInfoBypass: boolean;
  reason?: string;
}

export type ModerationContract = AgentContract<ModerationInput, ModerationContext, ModerationOutput>;

// ----------------------------------------------------------------------
// 9. Agente de Recomendaciones
// ----------------------------------------------------------------------
export interface RecommendationInput {
  userId: string;
  actorType: 'PLAYER_WITH_CLUB' | 'CHILD' | 'FAMILY' | 'CLUB' | 'ACADEMY';
}

export interface RecommendationContext {
  recentSearches: string[];
  profileCompleteness: number;
  recommendationsSentThisWeek: number;
}

export interface RecommendationItem {
  id: string;
  type: string;
  reason: string;
}

export interface RecommendationOutput {
  recommendations: RecommendationItem[];
}

export type RecommendationContract = AgentContract<
  RecommendationInput,
  RecommendationContext,
  RecommendationOutput
>;

// ----------------------------------------------------------------------
// 10. Agente de Inteligencia Geográfica (Fase Geo)
// ----------------------------------------------------------------------
export interface GeoIntelligenceInput {
  userId: string;
  isMinor: boolean;
  searchRadiusKm?: number;
}

export interface GeoIntelligenceContext {
  assignedZoneName: string;
  clubDensityInZone: number;
  urgencyPriority: number;
  competitiveLevelPriority: number;
}

export interface GeoIntelligenceOutput {
  displayZoneLabel: string; // Ej: "Zona Norte (Aprox. 5km)"
  exactCoordinatesExposed: false; // Invariante estricta: SIEMPRE false
  prioritizationOrder: ['URGENCY', 'COMPETITIVE_LEVEL', 'PROXIMITY'];
}

export type GeoIntelligenceContract = AgentContract<
  GeoIntelligenceInput,
  GeoIntelligenceContext,
  GeoIntelligenceOutput
>;
