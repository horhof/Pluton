// This module defines the Ticker class which moves the game along.

import { forEach } from 'lodash'
import { query } from './Database'
import { stampLog } from './Log'
import { Fleet } from './models/Fleet'

const log = stampLog(`Ticker`)

const DISABLE_TICKER = true

export class Ticker {
  tick = 0

  /** One tick every minute. */
  intervalMs = 60000

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
    const $ = log(`distributeNewShips`)

    const readRes = await query({ noun: 'base_fleets' })

    if (!readRes.ok) {
      throw new Error(`Failed to read planets`)
    }

    const bases = await readRes.json() as Fleet[]
    forEach(bases, b => {
      b.ships += 1
    })

    const updateRes = await query({
      verb: 'post',
      noun: 'fleets',
      body: bases,
      headers: { Prefer: 'resolution=merge-duplicates' },
    })

    if (!updateRes.ok) {
      const json = await updateRes.json()
      $(`Failed to update planets. Res=%o`, json)
      throw new Error
    }
  }

  private async fight(): Promise<void> {
  }

  /**
   * Any fleets en route have their ETAs decreased until they land.
   */
  private async move(): Promise<void> {
    const $ = log(`move`)

    const readRes = await query({ noun: 'fleets?is_base=is.false&is_warping=is.true&eta=gt.0' })

    if (!readRes.ok) {
      $(`Failed to read fleets. Res=%O`, await readRes.json())
      throw new Error(`Failed to read fleets.`)
    }

    const fleets = await readRes.json() as Fleet[]

    forEach(fleets, b => {
      const newEta = b.eta - 1
      $(`Decreasing ETA of fleet %o from %o to %o`, b.id, b.eta, newEta)
      b.eta = newEta
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
