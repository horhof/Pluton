import { getLog } from '../Logger'
const debug = getLog(`Http:Resource`)

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import * as sequelize from 'sequelize'
import { Code, Ctrl } from './Ctrl'

export abstract class ResourceCtrl extends Ctrl {
  static URI: string

  constructor(
    protected server: restify.Server,
    protected model: sequelize.Model<any, any>,
    protected uri: string
  ) {
    super()
    debug(`New> Binding routes... Uri=%o`, this.uri)
    this.server.get(`/${this.uri}`, this.get.bind(this))
    this.server.get(`/${this.uri}/:id`, this.getId.bind(this))
    this.server.post(`/${this.uri}`, this.post.bind(this))
    this.server.put(`/${this.uri}/:id`, this.putId.bind(this))
  }

  protected get(_: Req, res: Res) {
    debug(`GET /${this.uri}>`)
    this.model.findAll()
      .then(records => res.json(Code.OK, records))
      .catch(this.abort(res))
  }

  protected getId(req: Req, res: Res) {
    debug(`GET /${this.uri}/:id>`)
    const id = this.checkId(req, res)
    if (!id) return
    this.model.findById(id)
      .then(record => {
        if (!record) return res.json(Code.NOT_FOUND, { message: `Record ${id} couldn't be found.` })
        res.json(Code.OK, record)
      })
  }

  protected post(req: Req, res: Res) {
    debug(`POST /${this.uri}>`)
    const data = the(req).get('body')
    if (!data) return res.json(Code.BAD_REQ, { message: `No data to add.` })
    this.model.create(data)
      .then(record => res.json(Code.OK, record))
      .catch(this.abort(res))
  }

  protected putId(req: Req, res: Res) {
    debug(`PUT /${this.uri}/:id>`)
    const id = this.checkId(req, res)
    if (!id) return
    const data = the(req).get('body')
    if (!data) return res.json(Code.BAD_REQ, { message: `No data to add.` })
    this.model.update(data, { where: { id } })
      .then(([affectedRows]) => res.json(Code.OK, { affectedRows }))
      .catch(this.abort(res))
  }
}