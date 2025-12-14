const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const services = [
  'identity-issuer',
  'proof-verification', 
  'credential-revocation',
  'edge-middleware'
];

function setupDatabase(serviceName) {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, `${serviceName}.sqlite`);
    const schemaPath = path.join(__dirname, `${serviceName}.sql`);
    
    const db = new sqlite3.Database(dbPath);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    db.exec(schema, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`${serviceName} database initialized successfully`);
        resolve(dbPath);
      }
      db.close();
    });
  });
}

function setupAllDatabases() {
  return Promise.all(services.map(setupDatabase));
}

function getDbPath(serviceName) {
  return path.join(__dirname, `${serviceName}.sqlite`);
}

if (require.main === module) {
  setupAllDatabases().catch(console.error);
}

module.exports = { setupDatabase, setupAllDatabases, getDbPath };