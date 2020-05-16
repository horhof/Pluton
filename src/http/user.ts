import { getPlanet } from '../data/planet'
import { getPlanetIdForUser } from '../data/user'
import { render as renderMilitary } from '../html/military'
import { render as renderLoginForm } from '../html/login'
import { render as renderProduction } from '../html/production'
import { stampLog } from '../log'
import { Ctx, showErr } from '../server'
import { getFleetsForPlanet } from '../data/fleet'
import { getString } from '../validation'
import { db } from '../db/conn'

const log = stampLog(`http:user`)

export enum CookieKeys {
  Username = 'pluton-username',
  Token = 'pluton-token',
  Planet = 'pluton-planet',
}

/** /login.html */
export const getLoginForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getLoginForm`)

    ctx.type = 'html'
    ctx.body = renderLoginForm()
  }

/** /rpc/login.html { username, password } */
export const login =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`login`)

    const username = getString(ctx.query, 'username')
    if (!username) {
      return showErr(ctx, `"${username}" is not a valid username.`, $, 400)
    }

    const password = getString(ctx.query, 'password')
    if (!password) {
      return showErr(ctx, `"${username}" is not a valid password.`, $, 400)
    }

    const getRes = await db.get(`
        SELECT
          planet_id
        , password
        FROM users
        WHERE username = $1
      `,
      [username],
      (r: any) => ({
        dbPassword: r.password as string,
        planetId: r.planet_id as number,
      }))
    if (getRes instanceof Error) {
      $(`Failed to query user: %o.`, getRes.message)
      throw getRes
    }
    const [row] = getRes
    if (row === undefined) {
      return showErr(ctx, `Invalid password.`, $, 403)
    }
    const { dbPassword, planetId } = row
    if (password !== dbPassword) {
      return showErr(ctx, `Invalid password.`, $, 403)
    }

    const token = String(Date.now())
    const updateRes = await db.query(`
        UPDATE users
        SET token = $1
        WHERE username = $2
      `,
      [token, username])
    if (updateRes instanceof Error) {
      $(`Failed to update losing fleets: %o.`, updateRes.message)
      throw updateRes
    }

    ctx.cookies.set(CookieKeys.Username, username)
    ctx.cookies.set(CookieKeys.Token, token)
    ctx.cookies.set(CookieKeys.Planet, String(planetId))

    ctx.redirect(`../planets/${planetId}.html`)
  }

/** /military.html */
export const getMilitary =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getMilitary`)

    // Validate auth.
    const username = ctx.cookies.get(CookieKeys.Username)
    const token = ctx.cookies.get(CookieKeys.Token)
    const authRes = await getPlanetIdForUser(username, token)
    if (authRes instanceof Error || authRes === undefined) {
      return ctx.redirect('login.html')
    }
    const planetId = authRes

    $(`Done. Fetching planet %o...`, planetId)
    const planetRes = await getPlanet(planetId)
    if (planetRes instanceof Error) {
      return showErr(ctx, planetRes.message, $, 500)
    }
    if (planetRes === undefined) {
      return showErr(ctx, `No such planet "${planetId}"`, $, 404)
    }
    const planet = planetRes

    $(`Done. Fetching fleets for planet %o...`, planetId)
    const fleetsRes = await getFleetsForPlanet(planetId)
    if (fleetsRes instanceof Error) {
      return showErr(ctx, fleetsRes.message, $, 500)
    }
    const fleets = fleetsRes

    ctx.type = 'html'
    ctx.body = renderMilitary(planet, fleets)
  }

/** /production.html */
export const getProduction =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getProduction`)

    // Validate auth.
    const username = ctx.cookies.get(CookieKeys.Username)
    const token = ctx.cookies.get(CookieKeys.Token)
    const authRes = await getPlanetIdForUser(username, token)
    if (authRes instanceof Error || authRes === undefined) {
      return ctx.redirect('login.html')
    }
    const planetId = authRes

    $(`Done. Fetching planet %o...`, planetId)
    const planetRes = await getPlanet(planetId)
    if (planetRes instanceof Error) {
      return showErr(ctx, planetRes.message, $, 500)
    }
    if (planetRes === undefined) {
      return showErr(ctx, `No such planet "${planetId}"`, $, 404)
    }
    const planet = planetRes

    ctx.type = 'html'
    ctx.body = renderProduction(planet, [])
  }
