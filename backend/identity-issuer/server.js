const express = require('express');
const cors = require('cors');
const Database = require('./shared/database');
const EventBus = require('./shared/eventBus');
const identityRoutes = require('./routes/identityRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database and event bus
const db = new Database('identity-issuer');
const eventBus = new EventBus();

// Database is already initialized by setup script
async function initDatabase() {
  console.log('Using identity-issuer database');
}

// Make db and eventBus available to routes
app.locals.db = db;
app.locals.eventBus = eventBus;

app.use('/identities', identityRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Identity-Issuer' });
});

async function startServer() {
  try {
    await initDatabase();
    await eventBus.connect();
    
    app.listen(PORT, () => {
      console.log(`Identity-Issuer Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Identity-Issuer Service:', error);
  }
}

startServer();