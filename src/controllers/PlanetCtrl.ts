import { chain, get } from 'lodash'
import { stampLog } from '../Log'
import { Ctx, endReq } from '../Server'
import { query } from '../Database'
import { Planet } from '../Planet'

const log = stampLog(`Http:Planet`)

enum PlanetCtrlErr {
  GENERAL,
}

/** GET /planets/new.html */
export const createPlanetForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanetForm`)

    ctx.type = 'html'
    const template = require('../templates/CreatePlanet.marko')
    ctx.body = template.stream()
  }

/** POST /planets/new.json */
export const createPlanet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanet`)

    const args = ctx.request.body
    const name = get(args, 'name')
    const star_id = get(args, 'star_id')
    const index = get(args, 'index')
    const body = { name, star_id, index }

    const res = await query(`planets`, body, `post`)

    if (!res.ok) {
      return endReq(ctx, `Failed to create planet "${JSON.stringify(body)}".`, $, res.status)
    }

    const h = res.headers.get('location') || ''
    const m = h.match(/(\d+)/)
    const id = m && m[1]

    ctx.body = { url: `/planets/${id}.html` }
    //ctx.body = `<a href="/planets/${id}">${name}</a>`
  }

/** GET /planets.html */
export const readPlanets =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getPlanets`)
  }

/** GET /planet.html */
export const readMyPlanet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readMyPlanet`)

    ctx.params.id = 1
    await readPlanet(ctx)
  }

/** GET /planets/1.html */
export const readPlanet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readPlanet`)

    const id = chain(ctx.params).get('id').toNumber().value()

    if (!isFinite(id)) {
      return endReq(ctx, `"${id}" is not a valid planet ID.`, $, 400)
    }

    const res = await query(`planets?id=eq.${id}&select=*,star:stars(*),fleets(*)`)

    if (!res.ok) {
      return endReq(ctx, `Can't find planet "${id}" not valid.`, $, 404)
    }

    $(`Res=%O`, res)
    const data = await res.json() as Planet[]

    if (data.length < 1) {
      return endReq(ctx, `Can't find planet "${id}".`, $, 404)
    }

    const input = data[0]
    $(`Input=%O`, input)
    ctx.type = 'html'
    const template = require('../templates/Planet.marko')
    ctx.body = template.stream(input)
  }
