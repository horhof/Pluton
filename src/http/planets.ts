import { getFleetsForPlanet } from '../data/fleet'
import { createPlanet, getPlanet } from '../data/planet'
import { getStar, getStarByPlanet } from '../data/star'
import { render as renderNewPlanetForm } from '../html/newPlanet'
import { render as renderPlanet } from '../html/planet'
import { stampLog } from '../log'
import { Ctx, showErr } from '../server'
import { getNumber, getProperty, getString } from '../validation'
import { CookieKeys } from './user'
import { getPlanetIdForUser, createUser } from '../data/user'
import { db } from '../db/conn'

const log = stampLog(`http:planet`)

/** /planets/<ID>.html */
export const getPlanetById =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getPlanetById`)

    const username = ctx.cookies.get(CookieKeys.Username)
    const token = ctx.cookies.get(CookieKeys.Token)
    const authRes = await getPlanetIdForUser(username, token)
    // @ts-ignore
    const userPlanetId = isFinite(authRes) ? authRes : undefined

    $(`Parsing parameters...`)
    const id = getProperty<number>(ctx.params, 'id', Number, isFinite)
    if (!id) {
      return showErr(ctx, `"${id}" is not a valid ID.`, $, 400)
    }

    $(`Done. Fetching planet %o...`, id)
    const planetRes = await getPlanet(id)
    if (planetRes instanceof Error) {
      return showErr(ctx, planetRes.message, $, 500)
    }
    if (planetRes === undefined) {
      return showErr(ctx, `No such planet "${id}"`, $, 404)
    }
    const planet = planetRes

    $(`Done. Fetching star for planet %o...`, id)
    const starRes = await getStarByPlanet(id)
    if (starRes instanceof Error) {
      return showErr(ctx, starRes.message, $, 500)
    }
    if (starRes === undefined) {
      return showErr(ctx, `Planet ${id} has no star`, $, 500)
    }
    const star = starRes

    $(`Done. Fetching fleets for planet %o...`, id)
    const fleetsRes = await getFleetsForPlanet(id)
    if (fleetsRes instanceof Error) {
      return showErr(ctx, fleetsRes.message, $, 500)
    }
    const fleets = fleetsRes

    ctx.type = 'html'
    ctx.body = renderPlanet(planet, star, fleets, userPlanetId)
  }

/** /planets/new.html */
export const getNewPlanetForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getNewPlanetForm`)

    const qs = ctx.request.query || {}
    const { star_id } = qs
    if (!star_id) {
      return showErr(ctx, `Need a star to create this planet under.`, $, 400)
    }

    const res = await getStar(star_id)
    if (res instanceof Error) {
      return showErr(ctx, `Failed to get star ${star_id}".`, $, 500)
    }
    const star = res
    if (!star) {
      return showErr(ctx, `No such star ${star_id}".`, $, 404)
    }

    ctx.type = 'html'
    $(`Rendering form... StarId=%o Star=%o`, star_id, star)
    ctx.body = renderNewPlanetForm(star_id, star)
  }

/** /rpc/create-planet.html { star_id, name, ruler } */
export const createPlanetRpc =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanetRpc`)

    const args = ctx.request.query

    const username = getString(args, 'username')
    if (username === undefined) {
      return showErr(ctx, `No username was given.`, $, 400)
    }

    const password = getString(args, 'password')
    if (password === undefined) {
      return showErr(ctx, `No password was given.`, $, 400)
    }

    const name = getString(args, 'name')
    if (name === undefined) {
      return showErr(ctx, `No planet name was given.`, $, 400)
    }

    const ruler = getString(args, 'ruler')
    if (ruler === undefined) {
      return showErr(ctx, `No ruler name was given.`, $, 400)
    }

    const star_id = getNumber(args, 'star_id')
    if (star_id === undefined) {
      return showErr(ctx, `No star ID was given.`, $, 400)
    }

    const planet = { name, ruler, star_id }
    $(`Done. Planet=%o`, planet)

    const planetRes = await createPlanet(star_id, name, ruler)
    if (planetRes instanceof Error) {
      return showErr(ctx, `Failed to create planet: ${planetRes.message}`, $, 500)
    }
    const id = planetRes

    const userRes = await createUser(username, password, id)
    if (userRes instanceof Error) {
      return showErr(ctx, `Failed to create user for planet: ${userRes.message}`, $, 500)
    }

    const token = String(Date.now())
    const tokenRes = await db.query(`
        UPDATE users
        SET token = $1
        WHERE username = $2
      `,
      [token, username])
    if (tokenRes instanceof Error) {
      $(`Failed to insert token to log in user: %o.`, tokenRes.message)
      throw tokenRes
    }

    ctx.cookies.set(CookieKeys.Username, username)
    ctx.cookies.set(CookieKeys.Token, token)
    ctx.cookies.set(CookieKeys.Planet, String(id))

    ctx.redirect(`../planets/${id}.html`)
  }
