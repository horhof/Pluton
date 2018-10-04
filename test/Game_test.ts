import { expect, log } from './common'
expect
log

import { Game } from '../src/Game'
import { User } from '../src/User'

describe(`Game`, () => {
  let game: Game
  let bob: User

  beforeEach(async () => {
    log(`Creating game...`)
    game = new Game()
    log(`Starting game...`)
    await game.start()
    log(`Creating user...`)
    bob = await game.db.users.add({ name: 'bob' })
  })

  it(`should be able to move fleets`, async () => {
    log(`Fleets=%o`, game.db.fleets)
    await game.db.fleets.add({
      name: 'XIII',
      userId: bob.id,
      travelTime: 10,
    })

    const fleets = await game.db.fleets.getAll()
    expect(fleets).to.be.an('array')
  })
})