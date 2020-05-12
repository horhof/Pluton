import { assign, chain, get } from 'lodash'
import { getCreatedId, getInstance, getNextIndex, query } from '../Database'
import { stampLog } from '../Log'
import { Fleet, FleetState, createFleet } from '../models/Fleet'
import { Planet } from '../models/Planet'
import { Ctx, showErr } from '../Server'
import { isLeft } from '../types/Either'
import { getProperty } from './validation'
import { render as renderFleet } from '../templates/fleet'
import { render as renderNewFleet } from '../templates/newFleet'

const log = stampLog(`Http:Fleet`)

/** GET /fleets/<ID>.html */
export const readFleet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readFleet`)
    $(`Parsing parameters...`)
    const id = getProperty<number>(ctx.params, 'id', Number, isFinite)
    if (!id) {
      return showErr(ctx, `"${id}" is not a valid ID.`, $, 400)
    }
    $(`Done. Fetching fleet %o...`, id)
    const res = await getInstance<Fleet>({ noun: `fleets?id=eq.${id}&select=*,planet:planet_id(*),target:target_id(*)` })
    if (isLeft(res)) {
      return showErr(ctx, res.message, $, 404)
    }
    const fleet = res

    ctx.type = 'html'
    ctx.body = renderFleet(fleet, fleet.planet, fleet.target)
  }

/** PUT /fleets/<ID>.json */
export const updateFleet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`updateFleet`)
    const id = getProperty<number>(ctx.params, 'id', Number, isFinite)
    const noun = `fleets?id=eq.${id}`
    const body = ctx.request.body
    assign(body, { id })
    $(`Noun=%o Body=%o`, noun, body)
    if (body.target_id) {
      if (body.from_home > 0) {
        return showErr(ctx, `Fleet ${id} can't be given a target. It's ${body.from_home} ticks from home.`, $, 400)
      }
      $(`Fleet %o has a target: planet %o.`, id, body.target_id)
      body.warp_time = 6
      body.from_home = 0
      body.state = FleetState.WARP
      $(`Fleet=%o`, body)
    }
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
      return showErr(ctx, body.message, $, res.status)
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

    ctx.type = 'html'
    ctx.body = renderNewFleet(planet)
  }

/** POST /fleets/create.html, { planet_id, name } */
export const fleetsCreate =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createFleet`)
    $()

    const args = ctx.request.query
    const name = get(args, 'name')
    const planet_id = get(args, 'planet_id')

    const fleet = { name, planet_id }

    const res = await createFleet(planet_id, name)
    if (res instanceof Error) {
      return showErr(ctx, `Failed to create fleet: ${res.message}`, $, 500)
    }
    const id = res

    ctx.redirect(`${id}.html`)
  }
