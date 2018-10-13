import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'

import { ResourceCtrl } from './Resource'
import * as User from '../models/User'
import { Code } from './Ctrl';
import { getLog } from '../Logger'

const debug = getLog(`Http`)

export class UsersCtrl extends ResourceCtrl {
  protected model!: User.Users

  constructor(server: restify.Server, model: User.Users) {
    super(server, model, 'users')
    this.server.post(`/users/key`, this.postKey.bind(this))
  }

  protected async get(_: Req, res: Res) {
    this.model.findAll({
      include: [this.model.planets],
    })
      .then(records => res.json(Code.OK, records))
      .catch(this.abort(res))
  }

  protected async getById(req: Req, res: Res) {
    const id = this.getPlayerId(req)
    if (!id) return
    super.getById(req, res, {
      include: [this.model.planets],
      where: { id: this.getPlayerId(req) },
    })
  }

  protected async post(req: Req, res: Res) {
    debug(`POST /${this.uri}>`)
    const data = the(req).get('body')
    delete data.id
    if (!data) return res.json(400, { message: `No parameters were provided.` })
    this.model.init(data)
      .then(record => res.json(200, record))
      .catch(this.abort(res))
  }

  protected async postKey(req: Req, res: Res) {
    debug(`POST /${this.uri}/key>`)
    const data = the(req).get('body')
    delete data.id
    if (!data) return res.json(400, { message: `No parameters were provided.` })
    this.model.authenticate(data)
      .then(key => {
        if (!key) return this.abort(res, 400)(new Error(`Authentication failed.`))
        res.json(200, key)
      })
      .catch(this.abort(res))
  }
}