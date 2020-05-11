import { Pool } from 'pg'
import { Client } from './client'

const config = {
  host: 'localhost',
  user: '',
  password: '',
  database: 'pluton',
  port: 5432,
  max: 10
}

const pool = new Pool(config)

export const conn = new Client(pool)
