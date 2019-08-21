import { get } from 'lodash'
import { query } from '../Database'
import { stampLog } from '../Log'
import { Ctx } from '../Server'

const log = stampLog(`Http:Fleet`)

/** GET /fleets/new.html */
export const createFleetForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createFleetForm`)

    const template = require('../templates/CreateFleet.marko')
    ctx.type = 'html'
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
    const res = await query({ verb: 'post', noun: 'fleets', body })

    ctx.body = res.body
  }
