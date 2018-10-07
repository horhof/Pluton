import { getLog } from '../Logger'
const debug = getLog(`Http:Fleet`)

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'
import { Code } from './Ctrl'
import { ResourceCtrl } from './Resource'
import * as Fleet from '../models/Fleet'

export class FleetsCtrl extends ResourceCtrl {
  protected model: Fleet.Fleets

  constructor(server: restify.Server, model: Fleet.Fleets) {
    super(server, model, 'fleets')
    this.server.post(`/fleets/:id/warp/:planetId`, this.postIdWarp.bind(this))
  }

  protected post(req: Req, res: Res) {
    debug(`POST /${this.uri}>`)
    const data = the(req).get('body')
    if (!data) return res.json(Code.BAD_REQ, { message: `No data to add.` })
    this.model.add(data)
      .then(record => res.json(Code.OK, record))
      .catch(this.abort(res))
  }

  protected postIdWarp(req: Req, res: Res) {
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