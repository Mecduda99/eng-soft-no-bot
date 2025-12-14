const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor(serviceName) {
    const dbPath = path.resolve(__dirname, '../../database', `${serviceName}.sqlite`);
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
        throw err;
      }
    });
    
    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');
    // Set timeout
    this.db.run('PRAGMA busy_timeout = 30000');
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      // Validate SQL to prevent injection
      if (typeof sql !== 'string') {
        return reject(new Error('SQL must be a string'));
      }
      
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Database run error:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
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

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = Database;