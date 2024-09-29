const { Pool } = require('pg');

import 'dotenv/config'
const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_DB, POSTGRES_SSL_REJECT_UNAUTHORIZED } = process.env

export const db = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: process.env.POSTGRES_DB,

  ssl: process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED ? { rejectUnauthorized: false } : false
});

export const query = (text: string, params: any) => db.query(text, params);


