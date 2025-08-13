import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
  NODE_ENV,
} = process.env;

function resolvePort() {
  if (!MYSQL_PORT) return 3306;
  const numericPort = Number(MYSQL_PORT);
  if (!Number.isFinite(numericPort)) {
    throw new Error('MYSQL_PORT sayısal bir değer olmalıdır');
  }
  return numericPort;
}

// Production ortamında kritik env değişkenlerinin varlığını doğrula
if (NODE_ENV === 'production') {
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error(
      'Production ortamında MYSQL_HOST, MYSQL_USER ve MYSQL_DATABASE tanımlı olmalıdır'
    );
  }
}

// Boş string şifre kullanılıyorsa sürücüye undefined gönder ki "using password: NO" bağlansın
const normalizedPassword =
  typeof MYSQL_PASSWORD === 'string' && MYSQL_PASSWORD.length === 0
    ? undefined
    : MYSQL_PASSWORD;

const DB_NAME = MYSQL_DATABASE || 'blogdb';

export async function ensureDatabaseAndSchema() {
  const host = MYSQL_HOST || '127.0.0.1';
  const user = MYSQL_USER || 'root';
  const port = resolvePort();

  const connection = await mysql.createConnection({ host, user, password: normalizedPassword, port });
  try {
    // Veritabanı oluştur
    const safeDb = DB_NAME.replace(/`/g, '``');
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${safeDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.query(`USE \`${safeDb}\``);

    // users tablosu
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Eski tablolar için role kolonu ekle (varsa hata yutulur)
    try {
      await connection.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'");
    } catch {}

    // Varsayılan admin kullanıcısını garanti et
    const seedEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const seedPassword = process.env.DEFAULT_ADMIN_PASSWORD || '123456';
    const [adminRows] = await connection.query('SELECT id, role FROM users WHERE email = ? LIMIT 1', [seedEmail]);
    const adminExists = Array.isArray(adminRows) && adminRows.length > 0;
    if (!adminExists) {
      const hashed = await bcrypt.hash(seedPassword, 10);
      try {
        await connection.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [seedEmail, hashed, 'admin']);
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[db] Varsayılan admin oluşturuldu: ${seedEmail} / ${seedPassword}`);
        }
      } catch {}
    } else {
      // Varsayılan kullanıcı admin değilse admin'e yükselt
      const current = adminRows[0];
      if (current.role !== 'admin') {
        try {
          await connection.query('UPDATE users SET role = ? WHERE id = ?', ['admin', current.id]);
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[db] Varsayılan kullanıcı admin rolüne yükseltildi: ${seedEmail}`);
          }
        } catch {}
      }
    }

    // posts tablosu
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        coverUrl TEXT,
        date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } finally {
    await connection.end();
  }
}

const pool = mysql.createPool({
  host: MYSQL_HOST || '127.0.0.1',
  user: MYSQL_USER || 'root',
  password: normalizedPassword,
  database: DB_NAME,
  port: resolvePort(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
