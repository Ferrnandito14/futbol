/**
 * Script de interactividad para el prototipo de Startup Deportiva
 */

const mockTryouts = [
  {
    id: 'tryout-1',
    clubName: 'Rayo Majadahonda CF',
    category: 'Cadete Autonómica',
    position: 'Mediocentro Ofensivo (MCO)',
    zone: 'Madrid Noroeste (Ofuscada)',
    score: 94,
    urgency: 'Alta (Cierre en 48h)',
  },
  {
    id: 'tryout-2',
    clubName: 'CF Pozuelo de Alarcón',
    category: 'Cadete Preferente',
    position: 'Interior Izquierdo / MCO',
    zone: 'Madrid Oeste (Ofuscada)',
    score: 89,
    urgency: 'Media',
  },
  {
    id: 'tryout-3',
    clubName: 'Alcorcón B Formativo',
    category: 'Cadete Primera',
    position: 'Mediocentro',
    zone: 'Madrid Sur (Ofuscada)',
    score: 82,
    urgency: 'Baja',
  },
];

const mockAcademies = [
  {
    name: 'Academia Formativa Marcet Madrid',
    ages: '6 a 14 años',
    methodology: 'Desarrollo Técnico Individual y Valores',
    zone: 'Madrid Norte (Ofuscada)',
    price: 'Medio',
    verified: true,
  },
  {
    name: 'Escuela de Fútbol RFEF Las Rozas',
    ages: '5 a 16 años',
    methodology: 'Iniciación y Competición Base',
    zone: 'Madrid Noroeste (Ofuscada)',
    price: 'Asequible',
    verified: true,
  },
  {
    name: 'Technification Pro Soccer Academy',
    ages: '8 a 13 años',
    methodology: 'Alto Rendimiento y Biomecánica',
    zone: 'Pozuelo (Ofuscada)',
    price: 'Alto',
    verified: false,
  },
];

function setRole(roleKey) {
  // Update Buttons
  document.querySelectorAll('.role-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.role === roleKey);
  });

  // Update Panels
  document.querySelectorAll('.view-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `view-${roleKey}`);
  });

  logAgentEvent('SYS', `Cambio de contexto a vista de: ${roleKey.toUpperCase()}`);
}

function renderPlayerTryouts() {
  const tbody = document.getElementById('player-tryouts-list');
  if (!tbody) return;

  tbody.innerHTML = mockTryouts
    .map(
      (t) => `
    <tr>
      <td><strong>${t.clubName}</strong><br><small style="color:var(--warning)">${t.urgency}</small></td>
      <td><span class="badge badge-info">${t.category}</span></td>
      <td>${t.position}</td>
      <td>${t.zone}</td>
      <td><span class="badge badge-success" style="font-size:0.85rem">${t.score}%</span></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="applyToTryout('${t.id}', '${t.clubName}')">
          Postular
        </button>
      </td>
    </tr>
  `
    )
    .join('');
}

function renderAcademies() {
  const grid = document.getElementById('academies-list');
  if (!grid) return;

  grid.innerHTML = mockAcademies
    .map(
      (a) => `
    <div class="academy-card-item">
      <div style="display:flex; justify-content:space-between; align-items:flex-start">
        <h4>${a.name}</h4>
        ${
          a.verified
            ? '<span class="badge badge-success">Verificada</span>'
            : '<span class="badge badge-warning">Declarada</span>'
        }
      </div>
      <p style="font-size:0.82rem; color:var(--text-muted)">${a.methodology}</p>
      <div style="font-size:0.8rem">
        <div><strong>Edades:</strong> ${a.ages}</div>
        <div><strong>Zona:</strong> ${a.zone}</div>
        <div><strong>Tarifa:</strong> ${a.price}</div>
      </div>
      <button class="btn btn-outline btn-sm" style="margin-top:auto" onclick="requestAcademyContact('${a.name}')">
        Solicitar Información Segura
      </button>
    </div>
  `
    )
    .join('');
}

function applyToTryout(tryoutId, clubName) {
  const modal = document.getElementById('contact-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.innerText = `Postulación a Tryout — ${clubName}`;
  body.innerHTML = `
    <p style="margin-bottom:1rem; font-size:0.9rem">
      Estás postulando con tu perfil de <strong>David Silva Jr. (Cadete A)</strong>.<br>
      Tu historial deportivo se compartirá en estado <span class="badge badge-warning">Declarado</span>.
    </p>
    <div style="background:rgba(0,0,0,0.3); padding:0.75rem; border-radius:8px; margin-bottom:1rem; font-size:0.85rem">
      <div>🔒 <strong>Privacidad:</strong> Tus datos de contacto directo (teléfono/email) solo se compartirán si el club acepta tu postulación (Doble Opt-in Mutuo).</div>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:0.5rem">
      <button class="btn btn-outline" onclick="closeContactModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmApplication('${tryoutId}', '${clubName}')">Confirmar Postulación</button>
    </div>
  `;

  modal.classList.add('active');
}

function confirmApplication(tryoutId, clubName) {
  closeContactModal();
  logAgentEvent('AGENT_CONTACT', `Opt-in registrado por jugador para ${clubName}. Estado: PENDING`);
  logAgentEvent('AGENT_NOTIFICATION', `Notificación enviada a la secretaría técnica de ${clubName}`);
  alert(`✅ Postulación enviada con éxito a ${clubName}. El contacto directo se abrirá cuando el club acepte.`);
}

function showConsentAudit() {
  const modal = document.getElementById('contact-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.innerText = 'Registro de Consentimiento Parental (Audit Trail)';
  body.innerHTML = `
    <div style="font-family:var(--font-mono); font-size:0.8rem; background:#04060a; padding:1rem; border-radius:8px; line-height:1.6">
      <div>ID_CONSENTIMIENTO: pc_994827104</div>
      <div>MENOR: Mateo Rossi (ID: ch_7721)</div>
      <div>TUTOR_LEGAL: Carlos Rossi (ID: fa_1190)</div>
      <div>FECHA: 2026-08-20T10:14:22Z</div>
      <div>METODO: IN_APP_VERIFIED_SIGNATURE</div>
      <div>IP_REGISTRO: 185.23.44.12 (AES-256 Hashed)</div>
      <div>OFUSCACION_GEO: Nivel ZONA_POLIGONAL_ACTIVADA</div>
    </div>
    <div style="margin-top:1rem; text-align:right">
      <button class="btn btn-primary btn-sm" onclick="closeContactModal()">Cerrar</button>
    </div>
  `;

  modal.classList.add('active');
}

function closeContactModal() {
  document.getElementById('contact-modal').classList.remove('active');
}

function logAgentEvent(source, message, isBrake = false) {
  const consoleLog = document.getElementById('agent-console-log');
  if (!consoleLog) return;

  const entry = document.createElement('div');
  entry.className = `log-entry ${isBrake ? 'brake' : source === 'SYS' ? 'sys' : 'ok'}`;
  const now = new Date().toLocaleTimeString();
  entry.innerText = `[${now}] [${source}] ${message}`;

  consoleLog.appendChild(entry);
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

function clearLogs() {
  const consoleLog = document.getElementById('agent-console-log');
  if (consoleLog) consoleLog.innerHTML = '';
}

function simulateAgentPipeline() {
  clearLogs();
  logAgentEvent('SYS', 'Iniciando simulación del Pipeline de 10 Agentes...');

  setTimeout(() => {
    logAgentEvent('AGENT_ONBOARDING', 'Validados requisitos mínimos. Historial deportivo verificado presente.');
  }, 400);

  setTimeout(() => {
    logAgentEvent('AGENT_GEO', 'Ofuscada ubicación de menor (Radio 5km en Zona Noroeste). Coordenadas exactas = 0.');
  }, 800);

  setTimeout(() => {
    logAgentEvent('AGENT_MATCHING', 'Matching ejecutado: Urgencia (50%) + Nivel (30%) + Zona (20%). Top match: 94%');
  }, 1200);

  setTimeout(() => {
    logAgentEvent('AGENT_MODERATION', 'Escaneado mensaje de postulación: 0 números de teléfono ni emails detectados. APROBADO.');
  }, 1600);

  setTimeout(() => {
    logAgentEvent('AGENT_CONTACT', 'Doble Opt-in verificado entre Jugador y Club. Canal de comunicación seguro HABILITADO.');
  }, 2000);

  setTimeout(() => {
    logAgentEvent('AGENT_HISTORY', 'Registrado evento CLUB_MATCH_CONTACT con estado DECLARED en timeline.');
  }, 2400);
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  renderPlayerTryouts();
  renderAcademies();
});
