require('./env');
import { Pool } from 'pg';

const { 
  POSTGRES_HOST, 
  POSTGRES_PORT,
  POSTGRES_USER, 
  POSTGRES_PASSWORD, 
  POSTGRES_DB, 
} =  process.env;

const pool: Pool = new Pool({
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT || '5432'),
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
});

export default pool;
