import * as the from 'lodash'
import { Request as Req, Response as Res, Server } from 'restify'

import * as Planet from '../models/Planet'
import { Code } from './Ctrl'
import { ResourceCtrl } from './Resource'

export class PlanetsCtrl extends ResourceCtrl {
  protected model!: Planet.Planets

  constructor(server: Server, model: Planet.Planets) {
    super(server, model, 'planets')
  }

  protected async get(req: Req, res: Res) {
    const playerId = this.getPlayerId(req)
    this.logRequest()(`PlayerId=%o`, playerId)
    this.model.read()
      .then((records: Planet.Planet[]) => res.json(Code.OK, records))
      .catch(this.abort(res))
  }

  protected async post(req: Req, res: Res) {
    this.logRequest({ method: `POST` })()
    const data = the(req).get('body')
    if (!data) return res.json(Code.BAD_REQ, { message: `No parameters were provided.` })
    this.model.init(data)
      .then(record => res.json(Code.OK, record))
      .catch(this.abort(res))
  }
}