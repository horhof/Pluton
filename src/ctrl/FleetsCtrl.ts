import { getLog } from '../Logger'
const debug = getLog(`Http`)

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'

import { Fleets } from '../models/Fleet'

export class FleetsCtrl {
  constructor(
    private server: restify.Server,
    private model: Fleets,
  ) {
    this.server.get('/fleets', this.getFleets.bind(this))
    this.server.post('/fleets', this.postFleets.bind(this))
    this.server.put('/fleets/:id', this.putFleetsId.bind(this))
    /*
    this.server.get('/fleets/:id', this.getAccount.bind(this))
    this.server.del('/fleets/:id', this.deleteAccount.bind(this))
    */
  }

  private getFleets(_: Req, res: Res) {
    debug(`GET /fleets>`)
    this.model.getAll().then(data => res.json(200, data))
  }

  private postFleets(req: Req, res: Res) {
    debug(`POST /fleets`)
    const name = the(req).get('body.name')
    const userId = the(req).get('body.userId')
    this.model.add({ userId, name }).then(data => res.json(200, data))
  }

  private putFleetsId(req: Req, res: Res) {
    debug(`PUT /fleets/:id>`)
    const fleetId = the(req).get('params.id')
    const name = the(req).get('body.name')
    const userId = the(req).get('body.userId')
    const targetPlanetId = the(req).get('body.targetPlanetId')
    const data = { userId, name, targetPlanetId }
    debug(`PUT /fleets/:id> Data=%o`, data)
    this.model.edit(fleetId, data).then(data => res.json(200, data))
  }
}