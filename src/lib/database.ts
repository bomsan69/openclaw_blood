import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

// 외래 키 제약 조건 활성화
db.pragma('journal_mode = WAL');

// user 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// blood 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS blood (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    high INTEGER NOT NULL,
    low INTEGER NOT NULL,
    plus INTEGER NOT NULL,
    measured_at DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

console.log('✅ Database and tables created successfully!');

// 기본 테스트 사용자 추가 (선택사항)
const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
insertUser.run('kseniorusa', 'jaycho1151!@');

console.log('✅ Default user added: kseniorusa');

db.close();
