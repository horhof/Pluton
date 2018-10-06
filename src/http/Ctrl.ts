import { getLog } from '../Logger'
const debug = getLog(`Http:Ctrl`)

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import * as sequelize from 'sequelize'

export abstract class Ctrl {
  static URI: string

  constructor(
    protected server: restify.Server,
    protected model: sequelize.Model<any, any>,
    protected uri: string
  ) {
    debug(`New> Binding routes... Uri=%o`, this.uri)
    this.server.get(`/${this.uri}`, this.get.bind(this))
    this.server.get(`/${this.uri}/:id`, this.getId.bind(this))
    this.server.post(`/${this.uri}`, this.post.bind(this))
  }

  protected get(_: Req, res: Res) {
    debug(`GET /${this.uri}>`)
    this.model.findAll().then(records => res.json(200, records))
  }

  protected getId(req: Req, res: Res) {
    debug(`GET /${this.uri}/:id>`)
    const id = the(req).get('params.id')
    if (!id) return res.json(400, { message: `Not a valid ID: ${id}.` })
    this.model.findById(id)
      .then(record => {
        if (!record) return res.json(404, { message: `Record ${id} couldn't be found.` })
        res.json(200, record)
      })
  }

  protected post(req: Req, res: Res) {
    debug(`POST /${this.uri}>`)
    const data = the(req).get('body')
    if (!data) return res.json(400, { message: `No data to add.` })
    this.model.create(data).then(record => res.json(200, record))
  }
}