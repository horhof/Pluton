// This module spins up the HTTP server and other game components.

import { stampLog } from './log'
import { createServer } from './server'
import { Ticker } from './ticker'
import { getNumber, getString } from './validation'

const log = stampLog(`main`)
const $ = log()

const main =
  async () => {
    $(`Starting HTTP server...`)
    const prefix = getString(process.env, 'BASE_URL') || ''
    const port = getNumber(process.env, 'PORT') || 3000
    const server = await createServer(prefix)
    server.listen(port)
    $(`HTTP server listening at http://localhost:${port}${prefix ? `/${prefix}` : ''}`)

    const ticker = new Ticker
    $(`Starting ticker...`)
    ticker.start()
  }

process.on('unhandledRejection', err => {
  const $ = log()
  $(`Unhandled Rejection: %O.`, err)
  process.exit(1)
})

main()
