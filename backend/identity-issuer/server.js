const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const identityRoutes = require('./routes/identityRoutes');

// Simple database class
class SimpleDatabase {
  constructor(serviceName) {
    const dbPath = path.resolve(__dirname, '../../database', `${serviceName}.sqlite`);
    this.db = new sqlite3.Database(dbPath);
  }
  
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
  
  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Initialize database
const db = new SimpleDatabase('identity-issuer');

// Database is already initialized by setup script
async function initDatabase() {
  console.log('Using identity-issuer database');
}

// Make db available to routes
app.locals.db = db;
app.locals.eventBus = { publish: () => Promise.resolve() }; // Mock event bus

app.use('/identities', identityRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Identity-Issuer' });
});

async function startServer() {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`Identity-Issuer Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Identity-Issuer Service:', error);
  }
}

startServer();