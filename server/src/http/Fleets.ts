import * as the from 'lodash'
import { Request as Req, Response as Res, Server } from 'restify'
import { WhereOptions } from 'sequelize'

import { getLog } from '../Logger'
import { Fleet, Fleets } from '../models/Fleet'
import { Code } from './Ctrl'
import { ResourceCtrl } from './Resource'

const debug = getLog(`Http`)

export class FleetsCtrl extends ResourceCtrl {
  protected model!: Fleets

  constructor(server: Server, model: Fleets) {
    super(server, model, 'fleets')
    this.server.post(`/fleets/:id/warp/:planetId`, this.postIdWarp.bind(this))
  }

  protected async get(req: Req, res: Res) {
    const playerId = this.getPlayerId(req)
    this.logRequest()(`PlayerId=%o`, playerId)
    this.model.findAll({
      include: [{
        model: this.model.planets,
        include: [this.model.users]
      }],
      where: { '$planet->user.id$': playerId } as WhereOptions<Fleet>,
      order: [[`id`, `ASC`]],
    })
      .then((records: Fleet[]) => res.json(Code.OK, records))
      .catch(this.abort(res))
  }

  protected async post(req: Req, res: Res) {
    debug(`POST /${this.uri}>`)
    const data = the(req).get('body')
    delete data.id
    if (!data) return res.json(Code.BAD_REQ, { message: `No parameters were provided.` })
    this.model.add(data)
      .then(record => res.json(Code.OK, record))
      .catch(this.abort(res))
  }

  protected async postIdWarp(req: Req, res: Res) {
    debug(`POST /fleets/:id/warp/:planetId>`)
    const id = this.checkId(req, res)
    const planetId = this.checkId(req, res, 'planetId')
    debug(`POST /fleets/n/warp/p> Id=%o Planet=%o`, id, planetId)
    if (!id || !planetId) return
    debug(`POST /fleets/n/warp/p> Finding fleet...`)
    this.model.findById(id)
      .then(fleet => {
        debug(`POST /fleets/n/warp/p> Fleet=%o`, fleet)
        if (!fleet) return this.abort(res, Code.NOT_FOUND)(new Error(`Fleet not found.`))
        debug(`POST /fleets/n/warp/p> Found fleet.`)
        return fleet.warp(planetId)
          .then(record => res.json(Code.OK, record))
      })
      .catch(this.abort(res))
  }
}