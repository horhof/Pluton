import { forEach } from 'lodash'
import { stampLog } from './Log'
import { query, query2 } from './Database'
import { Fleet } from './Fleet'

const log = stampLog(`Ticker`)

export class Ticker {
  tick = 0

  intervalSec = 5

  start(): void {
    this.run()
    setInterval(() => {
      this.run()
    }, this.intervalSec * 1000)
  }

  private async run(): Promise<void> {
    const $ = log(`run`)

    this.tick++
    $(`Starting tick %o...`, this.tick)
    const fetchRes = await query(`home_fleets`)

    if (!fetchRes.ok) {
      throw new Error(`Failed to read planets`)
    }

    const json = await fetchRes.json() as Fleet[]
    forEach(json, j => {
      $(`Need to increment this. Fleet=%o`, j)
      j.size += 100
    })

    $(`Updating...`)
    const updateRes = await query2({
      verb: 'post',
      noun: 'fleets',
      body: json,
      headers: {
        Prefer: 'resolution=merge-duplicates',
      }
    })

    if (!updateRes.ok) {
      const json = await updateRes.json()
      $(`Failed to update planets. Res=%o`, json)
      throw new Error
    }

    $(`Done.`)
  }
}
