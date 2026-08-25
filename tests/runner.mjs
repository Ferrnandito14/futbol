/**
 * Verification & Test Suite Runner for Startup Deportiva
 * Valida reglas no negociables, contratos de agentes y estructura de datos.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Iniciando Suite de Verificación de Reglas No Negociables...');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASSED: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAILED: ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

// 1. Validar existencia y reglas de AGENTS.md
test('AGENTS.md debe existir y contener reglas no negociables', () => {
  const agentsMd = fs.readFileSync(path.join(rootDir, 'AGENTS.md'), 'utf8');
  assert.ok(agentsMd.includes('coordenadas exactas de menores'), 'Falta regla de coordenadas de menores');
  assert.ok(agentsMd.includes('Consentimiento parental obligatorio'), 'Falta regla de consentimiento parental');
  assert.ok(agentsMd.includes('Contacto directo oculto por defecto'), 'Falta regla de opt-in mutuo');
  assert.ok(agentsMd.includes('historial de clubes es OBLIGATORIO'), 'Falta regla de historial obligatorio');
  assert.ok(agentsMd.includes('COMET'), 'Falta referencia a bloqueo de COMET');
});

// 2. Validar esquema de Prisma con 20 entidades
test('prisma/schema.prisma debe definir las 20 entidades y enums requeridos', () => {
  const schema = fs.readFileSync(path.join(rootDir, 'prisma', 'schema.prisma'), 'utf8');
  const requiredModels = [
    'User', 'PlayerProfile', 'ChildProfile', 'FamilyProfile', 'ClubProfile',
    'AcademyProfile', 'ClubHistory', 'Tryout', 'TryoutApplication', 'Match',
    'ContactRequest', 'Message', 'Notification', 'ModerationLog', 'GeographicZone',
    'UserLocation', 'ParentalConsent', 'AgentLog', 'ScoutProfile', 'ProfessionalProfile'
  ];

  for (const model of requiredModels) {
    assert.ok(schema.includes(`model ${model} `), `Modelo faltante en schema: ${model}`);
  }

  assert.ok(schema.includes('DECLARED'), 'Enum VerificationStatus debe incluir DECLARED');
  assert.ok(schema.includes('exactCoordsEnc'), 'UserLocation debe incluir exactCoordsEnc');
  assert.ok(schema.includes('optinInitiator'), 'ContactRequest debe incluir optinInitiator');
  assert.ok(schema.includes('optinRecipient'), 'ContactRequest debe incluir optinRecipient');
});

// 3. Validar los 4 ADRs creados
test('docs/adr/ debe contener los 4 Architecture Decision Records base', () => {
  const adrFiles = fs.readdirSync(path.join(rootDir, 'docs', 'adr'));
  assert.ok(adrFiles.some(f => f.includes('0001-stack-tecnico-mvp')), 'Falta ADR 0001');
  assert.ok(adrFiles.some(f => f.includes('0002-politica-privacidad-menores')), 'Falta ADR 0002');
  assert.ok(adrFiles.some(f => f.includes('0003-doble-optin-contacto')), 'Falta ADR 0003');
  assert.ok(adrFiles.some(f => f.includes('0004-verificacion-datos-federativos-comet')), 'Falta ADR 0004');
});

// 4. Validar que el prototipo interactivo frontend esté completo
test('src/frontend/ debe contener index.html, styles.css y app.js', () => {
  const html = fs.readFileSync(path.join(rootDir, 'src', 'frontend', 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(rootDir, 'src', 'frontend', 'styles.css'), 'utf8');
  const js = fs.readFileSync(path.join(rootDir, 'src', 'frontend', 'app.js'), 'utf8');

  assert.ok(html.includes('David Silva Jr.'), 'HTML debe incluir demo de Jugador con Club');
  assert.ok(html.includes('Mateo Rossi'), 'HTML debe incluir demo de Niño + Familia');
  assert.ok(html.includes('Pipeline de los 10 Agentes'), 'HTML debe incluir monitor de agentes');
  assert.ok(js.includes('simulateAgentPipeline'), 'JS debe incluir simulador de pipeline');
  assert.ok(css.includes('--primary: #10b981'), 'CSS debe incluir paleta deportiva');
});

// 5. Validar lógica de moderación (detección de teléfonos / emails en texto libre)
test('Regla de Moderación: detectar intento de bypass de contacto directo', () => {
  const phonePattern = /(?:\+?[\d\s-]{8,15})|(?:6\d{2}[\s.-]?\d{3}[\s.-]?\d{3})/;
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  const textWithPhone = 'Hola, escríbeme al 612 345 678 para coordinar el fichaje';
  const textWithEmail = 'Contáctame en scout@futboltalento.es directo';
  const cleanText = 'Me interesa postularme como mediocentro ofensivo en la categoría Cadete A.';

  assert.ok(phonePattern.test(textWithPhone), 'Debe detectar teléfono');
  assert.ok(emailPattern.test(textWithEmail), 'Debe detectar email');
  assert.strictEqual(phonePattern.test(cleanText), false, 'Texto limpio no debe dar falso positivo');
  assert.strictEqual(emailPattern.test(cleanText), false, 'Texto limpio no debe dar falso positivo');
});

console.log('\n========================================');
console.log(`Resultados: ${passed} pasados, ${failed} fallidos`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ¡Todas las validaciones estructurales y de reglas no negociables han pasado!');
}
