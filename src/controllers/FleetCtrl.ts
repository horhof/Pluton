import { chain, get } from 'lodash'
import { stampLog } from '../Log'
import { Ctx, endReq } from '../Server'
import { query } from '../Database'
import { Fleet } from '../Fleet'

const log = stampLog(`Http:Fleet`)

enum FleetCtrlErr {
  GENERAL,
}

/** GET /fleets/new.html */
export const createFleetForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createFleetForm`)

    ctx.type = 'html'
    const template = require('../templates/CreateFleet.marko')
    ctx.body = template.stream()
  }

/** POST /fleets/new.json */
export const createFleet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createFleet`)
    const args = ctx.request.body
    const name = get(args, 'name')
    const star_id = get(args, 'star_id')
    const index = get(args, 'index')
    const body = { name, star_id, index }
    const res = await query(`fleets`, body, `post`)
    ctx.body = res.body
  }
