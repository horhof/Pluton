// This module defines the Ticker class which moves the game along.

import { forEach } from 'lodash'
import { query } from './Database'
import { stampLog } from './Log'
import { Fleet, FleetState } from './models/Fleet'
import { conn } from './db/conn'

const log = stampLog(`Ticker`)

const DISABLE_TICKER = false

export class Ticker {
  tick = 0

  /** One tick every minute. */
  intervalMs = 10000

  start(): void {
    this.run()
    setInterval(() => this.run(), this.intervalMs)
  }

  private async run(): Promise<void> {
    if (DISABLE_TICKER) {
      return
    }

    const $ = log(`run`)

    this.tick++
    $(`Starting tick %o...`, this.tick)

    $(`Updating bases with new ships...`)
    await this.allocateShips()

    $(`Moving fleets...`)
    await this.move()

    $(`Executing combat...`)
    await this.fight()

    $(`Done.`)
  }

  /**
   * The base of each planet is given a fixed number of ships per tick.
   */
  private async allocateShips(): Promise<void> {
    const $ = log(`allocateShips`)

    const res = await conn.selectRows(`
        SELECT
          id
        , name
        , index
        , planet_id
        , ships
        FROM base_fleets
      `, [], v => ({
        id: v.id as number,
        name: v.name as string,
        index: v.index as number,
        planet_id: v.planet_id as number,
        ships: v.ships as number,
      }))
    if (res instanceof Error) {
      throw res
    }
    const bases = res

    forEach(bases, async b => {
      const res = await conn.query(`
        UPDATE fleets
        SET ships = ships + 1
        WHERE id = $1
      `, [b.id])
      if (res instanceof Error) {
        throw res
      }
    })
  }

  private async fight(): Promise<void> {
  }

  /**
   * Any fleets en route have their ETAs decreased until they land.
   */
  private async move(): Promise<void> {
    const $ = log(`move`)

    const readRes = await query({ noun: `fleets?is_base=is.false&state=eq.${FleetState.WARP}` })
    if (!readRes.ok) {
      $(`Failed to read fleets. Res=%O`, await readRes.json())
      throw new Error(`Failed to read fleets.`)
    }

    const fleets = await readRes.json() as Fleet[]
    forEach(fleets, b => {
      if (b.from_home !== b.warp_time) {
        const newFromHome = b.from_home + 1
        $(`Moving fleet %o from %o to %o ticks from home`, b.id, b.from_home, newFromHome)
        b.from_home = newFromHome
      }
      else {
        $(`Fleet %o has arrived.`, b.id)
      }
    })

    const updateRes = await query({
      verb: 'post',
      noun: 'fleets',
      body: fleets,
      headers: { Prefer: 'resolution=merge-duplicates' },
    })
    if (!updateRes.ok) {
      const json = await updateRes.json()
      $(`Failed to update fleets. Res=%o`, json)
      throw new Error
    }
  }
}
