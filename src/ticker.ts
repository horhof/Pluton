// This module defines the Ticker class which moves the game along.

import { stampLog } from './log'
import { Fleet, FleetState, castFleet } from './data/fleet'
import { db } from './db/conn'

const log = stampLog(`ticker`)

const DISABLE_TICKER = false

export class Ticker {
  tick = 0

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

    const res = await db.get(`
        SELECT
          f.id
        , f.name
        , f.index
        , f.planet_id
        , f.ships
        FROM fleets AS f
        WHERE TRUE
          AND f.is_base IS TRUE
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

    bases.forEach(async b => {
      const res = await db.query(`
          UPDATE fleets
          SET ships = ships + 1
          WHERE id = $1
        `,
        [b.id])
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

    const res = await db.get(`
        SELECT
          *
        FROM fleets
        WHERE TRUE
          AND is_base IS FALSE
          AND state IN ($1, $2)
      `,
      [FleetState.WARP, FleetState.RETURN],
      castFleet)
    if (res instanceof Error) {
      throw res
    }
    const fleets = res

    fleets.forEach(async f => {
      switch (f.state) {
        case FleetState.WARP:
          if (f.from_home === f.warp_time) {
            f.state = FleetState.ARRIVED
            $(`Arrived.`)
          }
          else {
            f.from_home++
            $(`Moving. From home is now %o.`, f.from_home)
          }
          break
        case FleetState.RETURN:
          if (f.from_home === 0) {
            f.state = FleetState.HOME
            $(`Arrived.`)
          }
          else {
            f.from_home--
            $(`Moving. From home is now %o.`, f.from_home)
          }
          break
      }

      $(`Updating...`)
      const updateRes = await db.query(`
          UPDATE fleets
          SET
            state = $2
          , from_home = $3
          WHERE id = $1
        `,
        [f.id, f.state, f.from_home])
      if (updateRes instanceof Error) {
        throw updateRes
      }
    })
  }
}
