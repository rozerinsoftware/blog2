import mysql from 'mysql2/promise';

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env;

// Gerekli alanları doğrula ve anlaşılır hata ver
const required = {
  host: MYSQL_HOST || '127.0.0.1',
  user: MYSQL_USER || 'root',
  password: MYSQL_PASSWORD ?? '',
  database: MYSQL_DATABASE || 'blogdb',
  port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
};

const pool = mysql.createPool({
  host: required.host,
  user: required.user,
  password: required.password,
  database: required.database,
  port: required.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
