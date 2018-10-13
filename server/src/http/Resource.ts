import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import * as sequelize from 'sequelize'

import { Code, Ctrl } from './Ctrl'
import { User } from '../models/User'
import { getLog } from '../Logger'

const debug = getLog(`Http`)

export abstract class ResourceCtrl extends Ctrl {
  static URI: string
  protected get collectionUri() { return `/${this.uri}` }
  protected get recordUri() { return `/${this.uri}/:id` }

  constructor(
    protected server: restify.Server,
    protected model: sequelize.Model<any, any>,
    protected uri: string
  ) {
    super()
    debug(`New> Binding routes... Uri=%o`, this.uri)
    this.server.get(this.collectionUri, this.get.bind(this))
    this.server.post(this.collectionUri, this.post.bind(this))
    this.server.get(this.recordUri, this.getById.bind(this))
    this.server.put(this.recordUri, this.putById.bind(this))
    this.server.del(this.recordUri, this.deleteById.bind(this))
  }

  /**
   * Get a function for logging hits to a specific URI.
   *
   * - Uses GET methods by default.
   * - Uses a collection URI not using IDs by default.
   */
  protected logRequest(params?: { method?: string, uri?: string }) {
    const method = the(params).get(`method`, `GET`) as string
    const uri = the(params).get(`uri`, this.collectionUri) as string
    return function(format = ``, ...logParams: any) {
      debug(`${method} ${uri}> ${format}`, ...logParams)
    }
  }

  protected async get(_: Req, res: Res) {
    this.logRequest()()
    this.model.findAll({ order: [[`id`, `ASC`]] })
      .then(records => res.json(Code.OK, records))
      .catch(this.abort(res))
  }

  protected async getById(req: Req, res: Res, options?: sequelize.FindOptions<User>) {
    const id = this.checkId(req, res)
    if (!id) return
    this.logRequest({ uri: `/${this.uri}/${id}` })()
    this.model.findById(id, options)
      .then(record => {
        if (!record) return res.json(Code.NOT_FOUND, { message: `Record ${id} couldn't be found.` })
        res.json(Code.OK, record)
      })
  }

  protected async post(req: Req, res: Res) {
    this.logRequest({ method: `POST` })()
    const data = the(req).get('body')
    if (!data) return this.abort(res, Code.BAD_REQ)(new Error(`No parameters were provided.`))
    this.model.create(data)
      .then(record => res.json(Code.OK, record))
      .catch(this.abort(res))
  }

  protected async putById(req: Req, res: Res): Promise<void> {
    const id = this.checkId(req, res)
    if (!id) return
    this.logRequest({ method: `PUT`, uri: this.recordUri })
    const data = the(req).get(`body`)
    if (!data) return this.abort(res, Code.BAD_REQ)(new Error(`No parameters were provided.`))
    let affectedRows = 0
    try {
      [affectedRows] = await this.model.update(data, { where: { id } })
    } catch (error) { }
    if (affectedRows < 1)
      return this.abort(res, Code.NOT_FOUND)(new Error(`There was no ID '${id}' to delete.`))
    const record = await this.model.findById(id)
    res.json(Code.OK, record)
  }

  protected async deleteById(req: Req, res: Res): Promise<void> {
    const id = this.checkId(req, res)
    if (!id) return
    debug(`DELETE /${this.uri}/${id}>`)
    let affectedRows = 0
    try {
      affectedRows = await this.model.destroy({ where: { id } })
    } catch (error) { }
    if (affectedRows < 1)
      return this.abort(res, Code.NOT_FOUND)(new Error(`There was no ID '${id}' to delete.`))
    res.json(Code.OK)
  }
}