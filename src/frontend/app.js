/**
 * Startup Deportiva — Lógica del Cliente con Aislamiento Estricto por Rol
 * Los agentes operan discretamente dentro del software asistiendo al usuario.
 */

// Estado del Usuario en Sesión
let currentUser = null;
let currentRole = null;

// Mock Data
const mockTryoutsForPlayer = [
  {
    id: 'tryout-1',
    clubName: 'Rayo Majadahonda CF',
    category: 'Cadete Autonómica',
    position: 'Mediocentro Ofensivo (MCO)',
    zone: 'Madrid Noroeste',
    score: 94,
    urgency: 'Cierre en 48h',
  },
  {
    id: 'tryout-2',
    clubName: 'CF Pozuelo de Alarcón',
    category: 'Cadete Preferente',
    position: 'Interior Zurdo / MCO',
    zone: 'Madrid Oeste',
    score: 89,
    urgency: 'Convocatoria Abierta',
  },
];

const mockAcademiesForFamily = [
  {
    name: 'Academia Formativa Marcet Madrid',
    ages: '6 a 14 años',
    methodology: 'Desarrollo Técnico Individual y Valores',
    zone: 'Madrid Norte (Radio 5km)',
    price: 'Medio',
    verified: true,
  },
  {
    name: 'Escuela de Fútbol RFEF Las Rozas',
    ages: '5 a 16 años',
    methodology: 'Iniciación y Competición Base',
    zone: 'Madrid Noroeste (Radio 5km)',
    price: 'Asequible',
    verified: true,
  },
];

const mockClubCandidates = [
  {
    name: 'David Silva Jr.',
    category: 'Cadete A',
    position: 'Mediocentro Ofensivo',
    foot: 'Zurdo',
    currentClub: 'CD Las Rozas (Declarado)',
    zone: 'Madrid Noroeste',
    score: 94,
  },
  {
    name: 'Álvaro Morán',
    category: 'Cadete B',
    position: 'Defensa Central',
    foot: 'Diestro',
    currentClub: 'Alcorcón Formativo (Declarado)',
    zone: 'Madrid Sur',
    score: 85,
  },
];

// ----------------------------------------------------
// 1. INICIALIZACIÓN Y GESTIÓN DE SESIÓN
// ----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('startup_deportiva_session');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      currentRole = currentUser.role;
      renderPortal();
    } catch {
      showAuthScreen();
    }
  } else {
    showAuthScreen();
  }
});

function showAuthScreen() {
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('portal-screen').style.display = 'none';
  document.getElementById('onboarding-step-role').classList.add('active');
  document.getElementById('onboarding-step-form').classList.remove('active');
}

function selectOnboardingRole(role) {
  currentRole = role;
  document.getElementById('onboarding-step-role').classList.remove('active');
  document.getElementById('onboarding-step-form').classList.add('active');

  const titleEl = document.getElementById('form-role-title');
  const container = document.getElementById('dynamic-form-fields');

  if (role === 'PLAYER_WITH_CLUB') {
    titleEl.innerText = 'Crear Perfil de Jugador con Club';
    container.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nombre Completo <span class="required">*</span></label>
          <input type="text" id="player-name" class="form-input" placeholder="Ej: David Silva" required>
        </div>

        <div class="form-group">
          <label class="form-label">Categoría Federativa <span class="required">*</span></label>
          <select id="player-category" class="form-select" required>
            <option value="CADETE">Cadete (14-15 años)</option>
            <option value="JUVENIL">Juvenil (16-18 años)</option>
            <option value="INFANTIL">Infantil (12-13 años)</option>
            <option value="SENIOR">Senior (+18 años)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Posición Principal <span class="required">*</span></label>
          <select id="player-pos" class="form-select" required>
            <option value="Mediocentro Ofensivo">Mediocentro Ofensivo (MCO)</option>
            <option value="Extremo Izquierdo">Extremo Izquierdo (EI)</option>
            <option value="Extremo Derecho">Extremo Derecho (ED)</option>
            <option value="Defensa Central">Defensa Central (DFC)</option>
            <option value="Delantero Centro">Delantero Centro (DC)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Pie Dominante <span class="required">*</span></label>
          <select id="player-foot" class="form-select" required>
            <option value="Izquierdo">Izquierdo (Zurdo)</option>
            <option value="Derecho">Derecho (Diestro)</option>
            <option value="Ambidiextro">Ambidiextro</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Club Actual <span class="required">*</span></label>
          <input type="text" id="player-current-club" class="form-input" placeholder="Ej: CD Las Rozas" required>
        </div>

        <div class="form-group">
          <label class="form-label">Zona de Residencia <span class="required">*</span></label>
          <input type="text" id="player-zone" class="form-input" placeholder="Ej: Madrid Noroeste" required>
          <span class="form-hint">🔒 Tu dirección exacta nunca se comparte. Solo se muestra tu zona.</span>
        </div>

        <!-- REGLA NO NEGOCIABLE: HISTORIAL DE CLUBES OBLIGATORIO -->
        <div class="form-group full-width">
          <label class="form-label">Historial Deportivo Anterior <span class="required">* (Obligatorio)</span></label>
          <div class="history-builder">
            <div class="history-item-row">
              <input type="text" id="hist-club" class="form-input" placeholder="Club Anterior (Ej: CF Pozuelo)" required>
              <input type="text" id="hist-cat" class="form-input" placeholder="Categoría (Ej: Infantil A)" required>
              <input type="text" id="hist-season" class="form-input" placeholder="Temporada (Ej: 2024/25)" required>
              <span class="badge badge-warning" style="align-self:center">Declarado</span>
            </div>
            <span class="form-hint">Todos los registros federativos se etiquetan como "Declarados" hasta la integración oficial con COMET.</span>
          </div>
        </div>
      </div>
    `;
  } else if (role === 'FAMILY_CHILD') {
    titleEl.innerText = 'Registro de Familia & Menor a Cargo';
    container.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nombre del Tutor Legal / Representante <span class="required">*</span></label>
          <input type="text" id="parent-name" class="form-input" placeholder="Ej: Carlos Rossi" required>
        </div>

        <div class="form-group">
          <label class="form-label">Parentesco / Relación <span class="required">*</span></label>
          <select id="parent-rel" class="form-select" required>
            <option value="Padre / Madre">Padre / Madre</option>
            <option value="Tutor Legal">Tutor Legal</option>
            <option value="Representante">Representante Autorizado</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Nombre del Menor <span class="required">*</span></label>
          <input type="text" id="child-name" class="form-input" placeholder="Ej: Mateo Rossi" required>
        </div>

        <div class="form-group">
          <label class="form-label">Edad del Menor <span class="required">*</span></label>
          <select id="child-age" class="form-select" required>
            <option value="10">10 años (Benjamín)</option>
            <option value="8">8 años (Prebenjamín)</option>
            <option value="12">12 años (Alevín)</option>
            <option value="14">14 años (Infantil)</option>
          </select>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Zona o Ciudad de Residencia <span class="required">*</span></label>
          <input type="text" id="family-zone" class="form-input" placeholder="Ej: Pozuelo de Alarcón / Madrid Norte" required>
          <span class="form-hint">🔒 Las coordenadas GPS de menores están estrictamente ocultas por el Agente Geográfico.</span>
        </div>

        <!-- REGLA NO NEGOCIABLE: CONSENTIMIENTO PARENTAL OBLIGATORIO -->
        <div class="form-group full-width">
          <div class="consent-box">
            <input type="checkbox" id="parental-consent-check" required>
            <div class="consent-text">
              <h5>Consentimiento Parental Obligatorio</h5>
              <p>Como tutor legal, autorizo la creación del perfil formativo del menor. Entiendo que los datos de contacto directo están bloqueados y solo se revelarán mediante doble opt-in mutuo autorizado por mí.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (role === 'CLUB_ACADEMY') {
    titleEl.innerText = 'Registro de Club o Academia';
    container.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nombre Oficial de la Entidad <span class="required">*</span></label>
          <input type="text" id="club-name" class="form-input" placeholder="Ej: Rayo Majadahonda CF" required>
        </div>

        <div class="form-group">
          <label class="form-label">Tipo de Entidad <span class="required">*</span></label>
          <select id="club-type" class="form-select" required>
            <option value="CLUB">Club Federado</option>
            <option value="ACADEMY">Academia Formativa</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Federación / Registro <span class="required">*</span></label>
          <input type="text" id="club-fed" class="form-input" placeholder="Ej: RFEF - Madrid (Declarado)" required>
          <span class="form-hint">Se registrará como 'Declarado' en la base de datos.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Sede / Zona de Instalaciones <span class="required">*</span></label>
          <input type="text" id="club-zone" class="form-input" placeholder="Ej: Majadahonda / Madrid Noroeste" required>
        </div>

        <div class="form-group full-width">
          <label class="form-label">Categorías Activas en Búsqueda</label>
          <input type="text" id="club-categories" class="form-input" placeholder="Ej: Infantil Preferente, Cadete Autonómica">
        </div>
      </div>
    `;
  }

  lucide.createIcons();
}

function backToRoleSelect() {
  document.getElementById('onboarding-step-role').classList.add('active');
  document.getElementById('onboarding-step-form').classList.remove('active');
}

function handleProfileSubmit(e) {
  e.preventDefault();

  if (currentRole === 'PLAYER_WITH_CLUB') {
    currentUser = {
      role: 'PLAYER_WITH_CLUB',
      name: document.getElementById('player-name').value,
      category: document.getElementById('player-category').value,
      position: document.getElementById('player-pos').value,
      foot: document.getElementById('player-foot').value,
      currentClub: document.getElementById('player-current-club').value,
      zone: document.getElementById('player-zone').value,
      history: [
        {
          club: document.getElementById('hist-club').value,
          cat: document.getElementById('hist-cat').value,
          season: document.getElementById('hist-season').value,
          status: 'DECLARED',
        },
      ],
    };
  } else if (currentRole === 'FAMILY_CHILD') {
    const consentGiven = document.getElementById('parental-consent-check').checked;
    if (!consentGiven) {
      alert('❌ El consentimiento parental es obligatorio para continuar.');
      return;
    }

    currentUser = {
      role: 'FAMILY_CHILD',
      parentName: document.getElementById('parent-name').value,
      relationship: document.getElementById('parent-rel').value,
      childName: document.getElementById('child-name').value,
      childAge: document.getElementById('child-age').value,
      zone: document.getElementById('family-zone').value,
      parentalConsent: true,
      consentDate: new Date().toISOString(),
      consentIP: '185.23.44.12',
    };
  } else if (currentRole === 'CLUB_ACADEMY') {
    currentUser = {
      role: 'CLUB_ACADEMY',
      name: document.getElementById('club-name').value,
      type: document.getElementById('club-type').value,
      federation: document.getElementById('club-fed').value,
      zone: document.getElementById('club-zone').value,
      categories: document.getElementById('club-categories').value,
    };
  }

  localStorage.setItem('startup_deportiva_session', JSON.stringify(currentUser));
  renderPortal();
}

function loginDemo(roleKey) {
  if (roleKey === 'player') {
    currentUser = {
      role: 'PLAYER_WITH_CLUB',
      name: 'David Silva Jr.',
      category: 'Cadete A',
      position: 'Mediocentro Ofensivo (MCO)',
      foot: 'Zurdo',
      currentClub: 'CD Las Rozas (Cadete B)',
      zone: 'Madrid Noroeste',
      history: [
        { club: 'CD Las Rozas', cat: 'Cadete B', season: '2025/2026', status: 'DECLARED' },
        { club: 'CF Pozuelo', cat: 'Infantil A', season: '2023/2025', status: 'DECLARED' },
      ],
    };
  } else if (roleKey === 'family') {
    currentUser = {
      role: 'FAMILY_CHILD',
      parentName: 'Carlos Rossi',
      relationship: 'Padre',
      childName: 'Mateo Rossi',
      childAge: '10 años (Benjamín)',
      zone: 'Madrid Noroeste',
      parentalConsent: true,
      consentDate: new Date().toISOString(),
      consentIP: '185.23.44.12',
    };
  } else if (roleKey === 'club') {
    currentUser = {
      role: 'CLUB_ACADEMY',
      name: 'Rayo Majadahonda CF',
      type: 'CLUB',
      federation: 'RFEF Madrid (Declarado)',
      zone: 'Madrid Noroeste',
      categories: 'Infantil, Cadete, Juvenil',
    };
  }

  currentRole = currentUser.role;
  localStorage.setItem('startup_deportiva_session', JSON.stringify(currentUser));
  renderPortal();
}

function logout() {
  localStorage.removeItem('startup_deportiva_session');
  currentUser = null;
  currentRole = null;
  showAuthScreen();
}

// ----------------------------------------------------
// 2. RENDERIZADO AISLADO POR ROL
// ----------------------------------------------------
function renderPortal() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('portal-screen').style.display = 'block';

  const roleBadge = document.getElementById('current-user-role-badge');
  const userName = document.getElementById('current-user-name');
  const userSub = document.getElementById('current-user-sub');
  const content = document.getElementById('portal-dynamic-content');

  if (currentUser.role === 'PLAYER_WITH_CLUB') {
    roleBadge.innerText = '⚽ Jugador con Club';
    userName.innerText = currentUser.name;
    userSub.innerText = `${currentUser.category} • ${currentUser.zone}`;
    renderPlayerDashboard(content);
  } else if (currentUser.role === 'FAMILY_CHILD') {
    roleBadge.innerText = '👨‍👩‍👦 Familia & Menor';
    userName.innerText = `${currentUser.parentName} (Tutor)`;
    userSub.innerText = `Menor: ${currentUser.childName} • ${currentUser.zone}`;
    renderFamilyDashboard(content);
  } else if (currentUser.role === 'CLUB_ACADEMY') {
    roleBadge.innerText = '🏟️ Club / Academia';
    userName.innerText = currentUser.name;
    userSub.innerText = `Sede: ${currentUser.zone}`;
    renderClubDashboard(content);
  }

  lucide.createIcons();
}

// ----------------------------------------------------
// VISTA: JUGADOR CON CLUB
// ----------------------------------------------------
function renderPlayerDashboard(container) {
  container.innerHTML = `
    <div class="portal-view-header">
      <div>
        <h2>Mi Panel de Jugador</h2>
        <p class="subtitle">Gestiona tu perfil deportivo y postula a tryouts compatibles en tu zona.</p>
      </div>
    </div>

    <div class="dashboard-layout">
      <!-- Tarjeta de Perfil & Historial -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="id-card"></i> Ficha Deportiva</h3>
          <span class="badge badge-success">Perfil Activo</span>
        </div>

        <!-- Asistente de Completitud en Segundo Plano -->
        <div class="smart-agent-tip">
          <i data-lucide="sparkles"></i>
          <p>💡 <em>Completar videos de jugadas te dará 3x más visibilidad en convocatorias de clubes.</em></p>
        </div>

        <div class="profile-field-list">
          <div class="profile-field-row"><span>Club Actual:</span> <strong>${currentUser.currentClub}</strong></div>
          <div class="profile-field-row"><span>Posición:</span> <strong>${currentUser.position}</strong></div>
          <div class="profile-field-row"><span>Pie Dominante:</span> <strong>${currentUser.foot}</strong></div>
          <div class="profile-field-row"><span>Zona:</span> <strong>${currentUser.zone}</strong></div>
        </div>

        <div class="card-header" style="margin-top:1rem">
          <h3><i data-lucide="history"></i> Historial Deportivo</h3>
          <span class="badge badge-warning">Declarado</span>
        </div>
        <div class="timeline">
          ${currentUser.history
            .map(
              (h) => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <h4>${h.club} — ${h.cat}</h4>
                <span class="timeline-date">${h.season}</span>
                <span class="status-tag declared">Declarado</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Tryouts Ponderados por el Agente de Matching -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="search"></i> Tryouts y Convocatorias Compatibles</h3>
          <span class="badge badge-info">Ponderación: Urgencia > Nivel > Zona</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Club / Convocatoria</th>
              <th>Categoría</th>
              <th>Posición</th>
              <th>Compatibilidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${mockTryoutsForPlayer
              .map(
                (t) => `
              <tr>
                <td><strong>${t.clubName}</strong><br><small style="color:var(--warning)">${t.urgency}</small></td>
                <td><span class="badge badge-info">${t.category}</span></td>
                <td>${t.position}</td>
                <td><span class="badge badge-success" style="font-size:0.85rem">${t.score}%</span></td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="applyPlayerTryout('${t.clubName}')">
                    Postular
                  </button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// VISTA: FAMILIA / MENOR
// ----------------------------------------------------
function renderFamilyDashboard(container) {
  container.innerHTML = `
    <div class="portal-view-header">
      <div>
        <h2>Panel de Protección y Formación del Menor</h2>
        <p class="subtitle">Tutor: ${currentUser.parentName} • Menor a cargo: ${currentUser.childName} (${currentUser.childAge})</p>
      </div>
      <div class="badge badge-success" style="padding:0.5rem 0.9rem; font-size:0.85rem">
        <i data-lucide="shield-check"></i> Consentimiento Parental Activo
      </div>
    </div>

    <div class="dashboard-layout">
      <!-- Seguridad y Privacidad -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="lock"></i> Protocolo de Privacidad</h3>
          <span class="badge badge-success">Cifrado AES-256</span>
        </div>
        <div class="profile-field-list">
          <div class="profile-field-row"><span>Ubicación GPS:</span> <strong>Ofuscada a nivel de Zona</strong></div>
          <div class="profile-field-row"><span>Contacto Directo:</span> <strong>Bloqueado (Doble Opt-in)</strong></div>
          <div class="profile-field-row"><span>Receptor Notificaciones:</span> <strong>${currentUser.parentName} (Tutor)</strong></div>
        </div>
        <button class="btn btn-outline btn-sm" style="margin-top:auto" onclick="showParentAudit()">
          Ver Auditoría Legal de Consentimiento
        </button>
      </div>

      <!-- Academias Recomendadas -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="graduation-cap"></i> Academias Formativas en tu Zona</h3>
          <span class="badge badge-accent">Iniciación Deportiva</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:1rem">
          ${mockAcademiesForFamily
            .map(
              (a) => `
            <div style="background:rgba(9,13,20,0.5); border:1px solid var(--border-color); border-radius:10px; padding:1rem; display:flex; justify-content:space-between; align-items:center">
              <div>
                <h4>${a.name}</h4>
                <p style="font-size:0.82rem; color:var(--text-muted)">${a.methodology}</p>
                <div style="font-size:0.78rem; margin-top:0.3rem">
                  <span><strong>Edades:</strong> ${a.ages}</span> • <span><strong>Tarifa:</strong> ${a.price}</span>
                </div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="requestFamilyAcademy('${a.name}')">
                Solicitar Información
              </button>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// VISTA: CLUB / ACADEMIA
// ----------------------------------------------------
function renderClubDashboard(container) {
  container.innerHTML = `
    <div class="portal-view-header">
      <div>
        <h2>Gestión de Convocatorias y Búsqueda de Talento</h2>
        <p class="subtitle">${currentUser.name} • ${currentUser.federation}</p>
      </div>
      <button class="btn btn-primary" onclick="openPublishModal()">+ Publicar Convocatoria</button>
    </div>

    <div class="dashboard-layout club-layout">
      <!-- Convocatorias Activas -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="megaphone"></i> Convocatorias Activas</h3>
          <span class="badge badge-primary">2 en curso</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:1rem">
          <div style="background:rgba(9,13,20,0.5); border:1px solid var(--border-color); border-radius:10px; padding:1rem">
            <h4>Cadete Autonómica — Mediocentro Ofensivo</h4>
            <p style="font-size:0.82rem; color:var(--text-muted)">Prueba: Sábado 15:00 • Ciudad Deportiva</p>
            <div style="margin-top:0.75rem; display:flex; justify-content:space-between; align-items:center">
              <span class="badge badge-success">12 Postulaciones</span>
              <button class="btn btn-outline btn-xs" onclick="alert('Candidatos listados conforme al doble opt-in.')">Ver Candidatos</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Explorador de Jugadores Compatibles -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="users"></i> Jugadores Compatibles en tu Zona</h3>
          <span class="badge badge-info">Matching Inteligente</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Posición / Pie</th>
              <th>Historial</th>
              <th>Score</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${mockClubCandidates
              .map(
                (c) => `
              <tr>
                <td><strong>${c.name}</strong><br><small>${c.category}</small></td>
                <td>${c.position}<br><small>${c.foot}</small></td>
                <td><span class="status-tag declared">${c.currentClub}</span></td>
                <td><span class="badge badge-success">${c.score}%</span></td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="inviteCandidate('${c.name}')">
                    Invitar a Tryout
                  </button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// ACCIONES Y MODALES
// ----------------------------------------------------
function applyPlayerTryout(clubName) {
  showModal(
    `Postulación Segura a ${clubName}`,
    `
    <p style="font-size:0.9rem; margin-bottom:1rem">
      Estás postulando con tu ficha deportiva de <strong>${currentUser.name} (${currentUser.category})</strong>.
    </p>
    <div style="background:rgba(0,0,0,0.4); padding:0.85rem; border-radius:8px; margin-bottom:1rem; font-size:0.82rem">
      🔒 <strong>Doble Opt-in:</strong> Tus datos de contacto (teléfono y correo) se mantendrán ocultos hasta que ${clubName} revise tu ficha y acepte contactarte.
    </div>
    <div style="text-align:right">
      <button class="btn btn-primary" onclick="confirmPlayerApply('${clubName}')">Confirmar y Enviar</button>
    </div>
  `
  );
}

function confirmPlayerApply(clubName) {
  closeModal();
  alert(`✅ Tu postulación ha sido enviada a ${clubName}. Recibirás un aviso cuando acepten el contacto.`);
}

function showParentAudit() {
  showModal(
    'Auditoría Legal de Consentimiento Parental',
    `
    <div style="font-family:var(--font-mono); font-size:0.8rem; background:#04060a; padding:1rem; border-radius:8px; line-height:1.6">
      <div>TUTOR_LEGAL: ${currentUser.parentName}</div>
      <div>MENOR: ${currentUser.childName}</div>
      <div>FECHA_CONSENTIMIENTO: ${currentUser.consentDate}</div>
      <div>IP_REGISTRO: ${currentUser.consentIP} (Auditada)</div>
      <div>OFUSCACION_GEO: Zona Segura (Coordenadas exactas encriptadas)</div>
      <div>CANAL_MENSAJERIA: Exclusivo para el tutor legal</div>
    </div>
  `
  );
}

function requestFamilyAcademy(academyName) {
  alert(`✅ Solicitud enviada a ${academyName}. La secretaría de la academia responderá a través del portal del tutor.`);
}

function inviteCandidate(playerName) {
  alert(`✅ Invitación formal a tryout enviada a ${playerName}. El canal de chat se abrirá cuando el jugador o tutor acepte la convocatoria.`);
}

function openPublishModal() {
  showModal(
    'Publicar Convocatoria / Tryout',
    `
    <form onsubmit="event.preventDefault(); closeModal(); alert('✅ Convocatoria publicada con éxito.');">
      <div class="form-group" style="margin-bottom:0.75rem">
        <label class="form-label">Título de la Convocatoria</label>
        <input type="text" class="form-input" placeholder="Ej: Prueba Cadete Primera" required>
      </div>
      <div class="form-group" style="margin-bottom:0.75rem">
        <label class="form-label">Categoría</label>
        <select class="form-select">
          <option>Cadete</option>
          <option>Infantil</option>
          <option>Juvenil</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:1rem">
        <label class="form-label">Fecha y Lugar</label>
        <input type="text" class="form-input" placeholder="Ej: Sábado 11:00 en Campo Municipal" required>
      </div>
      <button type="submit" class="btn btn-primary btn-block">Publicar Tryout</button>
    </form>
  `
  );
}

function showModal(title, bodyHtml) {
  const modal = document.getElementById('app-modal');
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  modal.classList.add('active');
  lucide.createIcons();
}

function closeModal() {
  document.getElementById('app-modal').classList.remove('active');
}
