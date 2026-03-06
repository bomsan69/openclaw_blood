const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Check if period column exists
const tableInfo = db.prepare("PRAGMA table_info(blood)").all();
const hasPeriod = tableInfo.some(col => col.name === 'period');

if (!hasPeriod) {
  db.exec(`ALTER TABLE blood ADD COLUMN period TEXT DEFAULT '아침'`);
  console.log('✅ Added period column to blood table');
} else {
  console.log('ℹ️ period column already exists');
}

db.close();
