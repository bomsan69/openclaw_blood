import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

// 사용자 추가
export function addUser(username: string, password: string) {
  const db = getDatabase();
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  try {
    const result = stmt.run(username, password);
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: 'Username already exists' };
  }
}

// 사용자 인증
export function authenticateUser(username: string, password: string) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
  const user = stmt.get(username, password) as { id: number; username: string } | undefined;
  return user || null;
}

// 혈압 데이터 저장
export function saveBloodPressure(
  userId: number,
  high: number,
  low: number,
  plus: number,
  measuredAt: string
) {
  const db = getDatabase();
  const stmt = db.prepare(
    'INSERT INTO blood (user_id, high, low, plus, measured_at) VALUES (?, ?, ?, ?, ?)'
  );
  const result = stmt.run(userId, high, low, plus, measuredAt);
  return { success: true, id: result.lastInsertRowid };
}

// 혈압 데이터 조회 (필터링 및 페이지네이션)
export function getBloodPressureRecords(
  userId: number,
  startDate?: string,
  endDate?: string,
  page: number = 1,
  limit: number = 10
) {
  const db = getDatabase();
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM blood WHERE user_id = ?';
  let countQuery = 'SELECT COUNT(*) as total FROM blood WHERE user_id = ?';
  const params: (number | string)[] = [userId];
  
  if (startDate) {
    query += ' AND measured_at >= ?';
    countQuery += ' AND measured_at >= ?';
    params.push(startDate);
  }
  
  if (endDate) {
    query += ' AND measured_at <= ?';
    countQuery += ' AND measured_at <= ?';
    params.push(endDate);
  }
  
  query += ' ORDER BY measured_at DESC LIMIT ? OFFSET ?';
  
  const records = db.prepare(query).all(...params, limit, offset);
  const { total } = db.prepare(countQuery).get(...params.slice(0, -2)) as { total: number };
  
  return {
    records,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}
