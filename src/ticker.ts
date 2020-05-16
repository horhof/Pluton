// This module defines the Ticker class which moves the game along.

import { stampLog } from './log'
import { castPlanet } from './data/planet'
import { Fleet, FleetState, castFleet } from './data/fleet'
import { db } from './db/conn'

const log = stampLog(`ticker`)

const DISABLE_TICKER = false

const RESOURCE_PER_TICK = 100

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
    await this.generateResources()

    $(`Moving fleets...`)
    await this.move()

    $(`Executing combat...`)
    await this.fight()

    $(`Done.`)
  }

  private async generateResources(): Promise<void> {
    const res = await db.query(`
      UPDATE planets
      SET
        resource_m = resource_m + (asteroid_m * ${RESOURCE_PER_TICK})
      , resource_c = resource_c + (asteroid_c * ${RESOURCE_PER_TICK})
      , resource_r = resource_r + (asteroid_r * ${RESOURCE_PER_TICK})
    `)
    if (res instanceof Error) {
      throw res
    }
  }

  private async fight(): Promise<void> {
    const $ = log(`fight`)

    // Find all planets that are the target of some fleet that has arrived.
    const targetRes = await db.get(`
        SELECT
          DISTINCT ON (fleets.target_id)
          planets.*
        FROM fleets
        LEFT JOIN planets
          ON planets.id = fleets.target_id
        WHERE TRUE
          AND fleets.state = $1
      `,
      [FleetState.ARRIVED],
      castPlanet)
    if (targetRes instanceof Error) {
      throw targetRes
    }
    const targets = targetRes

    // For each of those target planets, find all the attackers on each.
    // targets.forEach(async t => {
    for await (const t of targets) {
      $(`Fight on %o.`, t.name)

      const attackerRes = await db.get(`
          SELECT
            *
          FROM fleets
          WHERE TRUE
            AND is_attacking IS TRUE
            AND target_id = $1
            AND state = $2
        `,
        [t.id, FleetState.ARRIVED],
        castFleet)
      if (attackerRes instanceof Error) {
        throw attackerRes
      }
      const attackers = attackerRes

      // Find all defenders of that planet.
      const defenderRes = await db.get(`
          SELECT
            *
          FROM fleets
          WHERE FALSE
            -- The base around the planet.
            OR (TRUE
              AND is_base IS TRUE
              AND planet_id = $1)
            -- The planet's mobile fleets at home.
            OR (TRUE
              AND is_base IS FALSE
              AND planet_id = $1
              AND state = 'home')
            -- The fleets coming in to defend the target.
            OR (TRUE
              AND state = 'arrived'
              AND is_attacking IS FALSE
              AND target_id = $1)
        `,
        [t.id],
        castFleet)
      if (defenderRes instanceof Error) {
        throw defenderRes
      }
      const defenders = defenderRes

      const attackerShipCount = attackers.reduce((sum, a) => sum + a.ships, 0)
      const defenderShipCount = defenders.reduce((sum, a) => sum + a.ships, 0)

      $(`Attackers=%o Ships=%o`, attackers.map(a => a.name), attackerShipCount)
      $(`Defenders=%o Ships=%o`, defenders.map(a => a.name), defenderShipCount)

      const losers = attackerShipCount > defenderShipCount
        ? defenders
        : attackers

      $(`Setting ships 0 for %o.`, losers)
      const updateRes = await db.query(`
          UPDATE fleets
          SET
            ships = 0
          , state = 'home'
          , is_attacking = FALSE
          , target_id = NULL
          , from_home = 0
          , warp_time = 0
          WHERE id = ANY ($1)
        `,
        [losers.map(l => l.id)])
      if (updateRes instanceof Error) {
        $(`Failed to update losing fleets: %o.`, updateRes.message)
        throw updateRes
      }
      $(`Done with update.`)
    }

    $(`Done with combat.`)
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
