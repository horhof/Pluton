import { getLog } from '../Logger'
const debug = getLog(`Http:Ctrl`)

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import * as sequelize from 'sequelize'

export enum Code {
  OK = 200,
  BAD_REQ = 400,
  NOT_FOUND = 404,
  SERVER_ERR = 500,
}

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

  protected abort(res: Res, code = Code.SERVER_ERR) {
    return function(err: Error) {
      res.json(code, err)
    }
  }

  /** Abort the request if an /:id parameter isn't valid, else return the ID. */
  protected checkId(req: Req, res: Res): number | undefined {
    const id = the(req).get('params.id') as number | undefined
    if (!id) return res.json(Code.BAD_REQ, { message: `Not a valid ID: ${id}.` })
    return id
  }
}