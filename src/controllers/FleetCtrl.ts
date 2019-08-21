import { chain, get } from 'lodash'
import { query } from '../Database'
import { stampLog } from '../Log'
import { Ctx, showErr } from '../Server'
import { Fleet } from '../Fleet';

const log = stampLog(`Http:Fleet`)

/** GET /fleets/1.html */
export const readFleet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readFleet`)

    const id = chain(ctx.params).get('id').toNumber().value()

    if (!isFinite(id)) {
      return showErr(ctx, `"${id}" is not a valid fleet ID.`, $, 400)
    }

    const res = await query({ noun: `fleets?id=eq.${id}` })

    if (!res.ok) {
      return showErr(ctx, `Can't find fleet "${id}" not valid.`, $, 404)
    }

    const data = await res.json() as Fleet[]

    if (data.length < 1) {
      return showErr(ctx, `Can't find fleet "${id}".`, $, 404)
    }

    const input = data[0]
    const template = require('../templates/Fleet.marko')
    ctx.type = 'html'
    ctx.body = template.stream(input)
  }

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
