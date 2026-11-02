import mysql from 'mysql2/promise';
import './env.js';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onecore_pharma',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 5000, // 5s connection timeout to prevent hanging requests
});

export const query = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('MySQL Query Error:', error.message);
    throw error;
  }
};

export const testConnection = async (timeoutMs = 5000) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`MySQL connection timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  const connectPromise = (async () => {
    const connection = await pool.getConnection();
    const dbName = process.env.DB_NAME || 'onecore_pharma';
    console.log(`✅ MySQL Database Connected successfully to: ${dbName}`);
    connection.release();
    return true;
  })();

  try {
    return await Promise.race([connectPromise, timeoutPromise]);
  } catch (error) {
    console.warn(`⚠️ MySQL Database Connection warning: ${error.message}`);
    console.warn('👉 Please verify MySQL service is running and check server/.env credentials.');
    return false;
  }
};

export default pool;

