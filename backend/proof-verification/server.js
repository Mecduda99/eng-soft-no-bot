const express = require('express');
const cors = require('cors');
const Database = require('./shared/database');
const EventBus = require('./shared/eventBus');
const proofRoutes = require('./routes/proofRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const db = new Database('proof-verification');
const eventBus = new EventBus();
const revocationCache = new Set();

async function initDatabase() {
  console.log('Using proof-verification database');
}

// Event consumers
async function setupEventConsumers() {
  await eventBus.subscribe('CredentialRevoked', (eventData) => {
    console.log(`[PROOF-VERIFICATION] Credencial Revogada: ${eventData.vc_id}`);
    revocationCache.add(eventData.vc_id);
  });

  await eventBus.subscribe('IdentityLinked', (eventData) => {
    console.log(`[PROOF-VERIFICATION] Identidade Vinculada: ${eventData.did}`);
  });
}

app.locals.db = db;
app.locals.eventBus = eventBus;
app.locals.revocationCache = revocationCache;

app.use('/proofs', proofRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Proof-Verification' });
});

async function startServer() {
  try {
    await initDatabase();
    await eventBus.connect();
    await setupEventConsumers();
    
    app.listen(PORT, () => {
      console.log(`Proof-Verification Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Proof-Verification Service:', error);
  }
}

startServer();