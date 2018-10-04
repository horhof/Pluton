import { Database } from '../src/data/Database'
import { expect, log } from './common'
log

describe(`Main`, () => {
  let db: Database

  beforeEach(async () => {
    db = new Database('data/test.json')
    await db.initialize()
  })

  it(`should add fleets`, async () => {
    const name = 'XVIII'
    const fleet = await db.fleets.add({ name })
    const test = await db.fleets.getById(fleet.id)
    expect(test).to.include({ name })
  })
})