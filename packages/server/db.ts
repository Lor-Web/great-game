import { Pool } from 'pg'

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env

export const pool = new Pool({
  host: DB_HOST || 'localhost',
  port: parseInt(DB_PORT || '5432', 10),
  database: DB_NAME!,
  user: DB_USER!,
  password: DB_PASSWORD!,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Опционально: проверка подключения при старте (без закрытия соединения)
export const checkDbConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect()
    const res = await client.query('SELECT NOW()')
    console.log('  ➜ 🎸 Connected to the database at:', res.rows[0].now)
    client.release() // не закрываем пул, просто возвращаем соединение обратно
  } catch (e) {
    console.error('❌ Database connection failed:', e)
    throw e // чтобы сервер не стартовал, если БД точно недоступна
  }
}
