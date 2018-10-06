import { getLog } from '../Logger'
const debug = getLog(`Ctrl:Fleets`)
debug

import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import { Fleets } from '../models/Fleet';

export class FleetsCtrl {
  constructor(
    private server: restify.Server,
    private model: Fleets
  ) {
    this.server.get('/fleets', this.listFleets.bind(this))
    /*
    this.server.post('/fleets', this.createAccount.bind(this))
    this.server.get('/fleets/:id', this.getAccount.bind(this))
    this.server.put('/fleets/:id', this.updateAccount.bind(this))
    this.server.del('/fleets/:id', this.deleteAccount.bind(this))
    */
  }

  private listFleets(_: Req, res: Res) {
    debug(`List fleets>`)
    this.model.getAll().then(data => res.json(200, data))
  }
}