import { getLog } from '../Logger'
const debug = getLog(`Http:User`)

import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import { Code, Ctrl } from './Ctrl'
import * as Game from '../Game'

export class GameCtrl extends Ctrl {
  constructor(
    private server: restify.Server,
    private game: Game.Game,
  ) {
    super()
    this.server.post(`/ticks`, this.postTicks.bind(this))
  }

  protected postTicks(_: Req, res: Res) {
    debug(`POST /ticks>`)
    this.game.tick()
      .then(result => res.json(Code.OK, result))
      .catch(this.abort(res))
  }
}