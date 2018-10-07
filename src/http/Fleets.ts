import { getLog } from '../Logger'
const debug = getLog(`Http:User`)

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import { Ctrl, Code } from './Ctrl'
import * as Fleet from '../models/Fleet'

export class FleetsCtrl extends Ctrl {
  protected model: Fleet.Fleets

  constructor(server: restify.Server, model: Fleet.Fleets) {
    super(server, model, 'fleets')
  }

  protected post(req: Req, res: Res) {
    debug(`POST /${this.uri}>`)
    const data = the(req).get('body')
    if (!data) return res.json(Code.BAD_REQ, { message: `No data to add.` })
    this.model.add(data)
      .then(record => res.json(Code.OK, record))
      .catch(this.abort(res))
  }
}