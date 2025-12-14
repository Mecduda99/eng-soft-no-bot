const express = require('express');
const cors = require('cors');
const Database = require('./shared/database');
const EventBus = require('./shared/eventBus');
const revocationRoutes = require('./routes/revocationRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const db = new Database('credential-revocation');
const eventBus = new EventBus();

async function initDatabase() {
  console.log('Using credential-revocation database');
}

app.locals.db = db;
app.locals.eventBus = eventBus;

app.use('/revocations', revocationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Credential-Revocation' });
});

async function startServer() {
  try {
    await initDatabase();
    await eventBus.connect();
    
    app.listen(PORT, () => {
      console.log(`Credential-Revocation Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Credential-Revocation Service:', error);
  }
}

startServer();