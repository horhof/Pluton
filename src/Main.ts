// This module spins up the whole HTTP server.

import { get } from 'lodash'
import { stampLog } from './Log'
import { createServer } from './Server'

const log = stampLog(`Main`)
const $ = log()

const main = async () => {
  const prefix = get(process.env, 'BASE_URL', '')
  const port = get(process.env, 'PORT', 3000)
  const server = await createServer(prefix)

  await server.listen(port)
  $(`HTTP server listening at http://localhost:${port}${prefix ? `/${prefix}` : ''}`)
}

process.on('unhandledRejection', err => {
  const $ = log()
  $(`Unhandled Rejection: %O.`, err)
  process.exit(1)
})

main()
