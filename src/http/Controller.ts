import { getLog } from '../Logger'
const debug = getLog(`Http:Ctrl`)

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import * as sequelize from 'sequelize'

export class Ctrl {
  static URI: string

  constructor(
    private server: restify.Server,
    private model: sequelize.Model<any, any>,
    private uri: string
  ) {
    debug(`New> Binding routes... Uri=%o`, this.uri)
    this.server.get(`/${this.uri}`, this.get.bind(this))
    this.server.get(`/${this.uri}/:id`, this.getId.bind(this))
    this.server.post(`/${this.uri}`, this.post.bind(this))
  }

  private get(_: Req, res: Res) {
    debug(`GET /${this.uri}>`)
    this.model.findAll().then(records => res.json(200, records))
  }

  private getId(req: Req, res: Res) {
    debug(`GET /${this.uri}/:id>`)
    const id = the(req).get('params.id')
    if (!id) return res.end(400)
    this.model.findById(id)
      .then(record => {
        if (!record) return res.end(404)
        res.json(200, record)
      })
  }

  private post(req: Req, res: Res) {
    debug(`POST /${this.uri}>`)
    const data = the(req).get('body')
    if (!data) return res.end(400)
    this.model.create(data).then(record => res.json(200, record))
  }
}