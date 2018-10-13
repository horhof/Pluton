import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'

import { Code, Ctrl } from './Ctrl'
import { Server } from '../Server'
import { getLog } from '../Logger'

const debug = getLog(`Http`)

export class GameCtrl extends Ctrl {
  constructor(
    private webserver: restify.Server,
    private game: Server,
  ) {
    super()
    this.webserver.post(`/ticks`, this.postTicks.bind(this))
  }

  protected async postTicks(_: Req, res: Res) {
    debug(`POST /ticks>`)
    this.game.tick()
      .then(result => res.json(Code.OK, result))
      .catch(this.abort(res))
  }
}