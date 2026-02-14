import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

// bomsan 사용자 추가
try {
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  const result = stmt.run('bomsan', 'ccie1103!!');
  console.log('✅ User "bomsan" added successfully! ID:', result.lastInsertRowid);
} catch (error: any) {
  if (error.message.includes('UNIQUE constraint failed')) {
    console.log('ℹ️ User "bomsan" already exists');
  } else {
    console.error('Error:', error.message);
  }
}

// 모든 사용자 확인
const users = db.prepare('SELECT id, username, created_at FROM users').all();
console.log('\n📋 Current users:');
users.forEach((user: any) => {
  console.log(`  - ${user.username} (ID: ${user.id}, Created: ${user.created_at})`);
});

db.close();
