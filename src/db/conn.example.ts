import { Pool } from 'pg'
import { Client } from './client'

const pool = new Pool({
  host: 'localhost',
  user: '',
  password: '',
  database: 'pluton',
  port: 5432,
  max: 10
})

export const db = new Client(pool)
