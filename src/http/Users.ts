import { getLog } from '../Logger'
const debug = getLog(`Http:User`)

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import { Ctrl } from './Ctrl'
import * as User from '../models/User'

export class UsersCtrl extends Ctrl {
  protected model: User.Users

  constructor(server: restify.Server, model: User.Users) {
    super(server, model, 'users')
  }

  protected getId(req: Req, res: Res) {
    debug(`GET /${this.uri}/:id>`)
    const id = the(req).get('params.id')
    if (!id) return res.json(400, { message: `Not a valid ID: ${id}.` })
    this.model.findById(id, { include: [this.model.planets] })
      .then(records => res.json(200, records))
      .catch(this.abort(res))
  }

  protected post(req: Req, res: Res) {
    debug(`POST /${this.uri}>`)
    const data = the(req).get('body')
    if (!data) return res.json(400, { message: `No data to add.` })
    this.model.initUser(data)
      .then(record => res.json(200, record))
      .catch(this.abort(res))
  }
}