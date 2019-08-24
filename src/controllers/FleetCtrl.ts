import { assign, chain, get } from 'lodash'
import { query, getCreatedId, getNextIndex } from '../Database'
import { stampLog } from '../Log'
import { Fleet } from '../models/Fleet'
import { Planet } from '../models/Planet'
import { Ctx, showErr, sendErr } from '../Server'

const log = stampLog(`Http:Fleet`)

/** GET /fleets/<ID>.html */
export const readFleet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readFleet`)

    const id = chain(ctx.params).get('id').toNumber().value()

    if (!isFinite(id)) {
      return showErr(ctx, `"${id}" is not a valid fleet ID.`, $, 400)
    }

    const res = await query({ noun: `fleets?id=eq.${id}&select=*,planet:planet_id(*),target:target_id(*)` })

    if (!res.ok) {
      return showErr(ctx, `Can't find fleet "${id}" not valid.`, $, 404)
    }

    const data = await res.json() as Fleet[]
    $(`Raw=%o`, data)

    if (data.length < 1) {
      return showErr(ctx, `Can't find fleet "${id}".`, $, 404)
    }

    const input = data[0]
    const template = require('../templates/Fleet.marko')
    ctx.type = 'html'
    ctx.body = template.stream(input)
  }

/** PUT /fleets/<ID>.json */
export const updateFleet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`updateFleet`)

    const id = chain(ctx.params).get('id').toNumber().value()

    if (!isFinite(id)) {
      return showErr(ctx, `"${id}" is not a valid fleet ID.`, $, 400)
    }

    const noun = `fleets?id=eq.${id}`
    const body = ctx.request.body
    assign(body, { id })
    $(`Noun=%o Body=%o`, noun, body)

    $(`Sending update for fleet %o...`, id)
    const res = await query({
      verb: 'patch',
      noun,
      body: [body],
    })

    if (!res.ok) {
      $(`Response was not OK.`)
      const body = await res.json()
      $(`Err=%o`, body)
      return sendErr(ctx, body.message, $, res.status)
    }

    $(`Success. Redirecting back to fleet %o.`, id)
    ctx.body = { url: `${id}.html` }
  }

/** GET /fleets/new.html */
export const createFleetForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createFleetForm`)

    const qs = ctx.request.query || {}
    const { planet_id } = qs
    if (!planet_id) {
      return showErr(ctx, `Need a planet to create this fleet for.`, $, 400)
    }

    const res = await query({ noun: `planets?id=eq.${planet_id}` })
    if (!res.ok) {
      return showErr(ctx, `Can't find planet "${planet_id}".`, $, 404)
    }
    const [planet] = await res.json() as Planet[]

    const template = require('../templates/NewFleet.marko')
    ctx.type = 'html'
    ctx.body = template.stream({ planet })
  }

/** POST /fleets/new.json */
export const createFleet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createFleet`)
    $()

    const args = ctx.request.body

    const name = get(args, 'name')
    const planet_id = get(args, 'planet_id')

    const fleet = { name, planet_id }

    $(`Looking up fleet numbers for planet %o ...`, planet_id)
    const index = await getNextIndex('planets', planet_id, 'fleets')
    assign(fleet, { index })

    $(`Creating fleet no. %o under planet %o...`, index, planet_id)
    const res2 = await query({ verb: 'post', noun: 'fleets', body: fleet })

    if (!res2.ok) {
      return sendErr(ctx, `Failed to create fleet "${JSON.stringify(fleet)}".`, $, res2.status)
    }

    const id = getCreatedId(res2.headers)
    if (!id) {
      return sendErr(ctx, `Failed to get created fleet.`, $, 500)
    }

    ctx.body = { url: `${id}.html` }
  }
