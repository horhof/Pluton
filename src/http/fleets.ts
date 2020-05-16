import { createFleet, getFleet, FleetState } from '../data/fleet'
import { getPlanet, Planet } from '../data/planet'
import { render as renderFleet } from '../html/fleet'
import { render as renderNewFleetForm } from '../html/newFleet'
import { stampLog } from '../log'
import { Ctx, showErr } from '../server'
import { getProperty, getNumber, getString } from '../validation'
import { db } from '../db/conn'

const log = stampLog(`http:fleets`)

/** /fleets/<ID>.html */
export const getFleetById =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getFleetById`)

    $(`Parsing parameters...`)
    const id = getProperty<number>(ctx.params, 'id', Number, isFinite)
    if (!id) {
      return showErr(ctx, `"${id}" is not a valid ID.`, $, 400)
    }
    $(`Done. Fetching fleet %o...`, id)
    const fleetRes = await getFleet(id)
    if (fleetRes instanceof Error) {
      return showErr(ctx, `Failed to get fleet ${id}: ${fleetRes.message}.`, $, 500)
    }
    if (fleetRes === undefined) {
      return showErr(ctx, `No such fleet ${id}`, $, 404)
    }
    const fleet = fleetRes

    $(`Done. Fetching planet for fleet %o...`, id)
    const planetRes = await getPlanet(fleet.planet_id)
    if (planetRes instanceof Error) {
      return showErr(ctx, `Failed to get planet for fleet ${id}: ${planetRes.message}.`, $, 500)
    }
    if (planetRes === undefined) {
      return showErr(ctx, `No such fleet ${id}`, $, 404)
    }
    const planet = planetRes

    let target: Planet | undefined
    if (fleet.target_id) {
      $(`Done. Fetching target for fleet %o...`, id)
      const targetRes = await getPlanet(fleet.target_id)
      if (targetRes instanceof Error) {
        return showErr(ctx, `Failed to get planet for fleet ${id}: ${targetRes.message}.`, $, 500)
      }
      if (targetRes === undefined) {
        return showErr(ctx, `No such fleet ${id}`, $, 404)
      }
      target = targetRes
    }

    // @ts-ignore
    const squadrons = []

    ctx.type = 'html'
    // @ts-ignore
    ctx.body = renderFleet(fleet, squadrons, planet, target)
  }

/** /fleets/new.html */
export const getNewFleetForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getNewFleetForm`)

    const qs = ctx.request.query || {}
    const { planet_id } = qs
    if (!planet_id) {
      return showErr(ctx, `Need a planet to create this fleet for.`, $, 400)
    }

    const planetRes = await getPlanet(planet_id)
    if (planetRes instanceof Error) {
      return showErr(ctx, planetRes.message, $, 500)
    }
    if (planetRes === undefined) {
      return showErr(ctx, `No such planet ${planet_id}`, $, 404)
    }
    const planet = planetRes

    ctx.type = 'html'
    ctx.body = renderNewFleetForm(planet)
  }

/** /rpc/createFleet.html { planet_id, name } */
export const createFleetRpc =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createFleetRpc`)
    $()

    const args = ctx.request.query

    const name = getString(args, 'name')
    if (name === undefined) {
      return showErr(ctx, `No ruler name was given.`, $, 400)
    }

    const planet_id = getNumber(args, 'planet_id')
    if (planet_id === undefined) {
      return showErr(ctx, `No planet ID was given.`, $, 400)
    }

    const res = await createFleet(planet_id, name)
    if (res instanceof Error) {
      return showErr(ctx, `Failed to create fleet: ${res.message}`, $, 500)
    }
    const id = res

    ctx.redirect(`../fleets/${id}.html`)
  }

/** /rpc/sendFleet.html { id, target_id } */
export const sendFleetRpc =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`sendFleetRpc`)

    const id = getNumber(ctx.query, 'id')
    if (id === undefined) {
      return showErr(ctx, `No fleet ID`, $, 400)
    }

    const targetId = getNumber(ctx.query, 'target_id')
    if (targetId === undefined) {
      return showErr(ctx, `No target ID`, $, 400)
    }

    const mission = getString(ctx.query, 'mission')
    if (mission === undefined) {
      return showErr(ctx, `No mission`, $, 400)
    }
    let isAttacking!: boolean
    if (mission === 'attack') {
      isAttacking = true
    }
    else if (mission === 'defend') {
      isAttacking = false
    }
    else {
      return showErr(ctx, `Invalid mission "${mission}".`, $, 400)
    }

    const fleetRes = await getFleet(id)
    if (fleetRes instanceof Error) {
      return showErr(ctx, `Failed to get fleet ${id}: ${fleetRes.message}`, $, 500)
    }
    if (fleetRes === undefined) {
      return showErr(ctx, `No such fleet ${id}`, $, 404)
    }
    const fleet = fleetRes

    if (fleet.state !== FleetState.HOME && fleet.target_id !== undefined) {
      if (fleet.from_home > 0) {
        return showErr(ctx, `Fleet ${id} can't be given a target. It's ${fleet.from_home} ticks from home.`, $, 400)
      }
    }

    const updateRes = await db.query(`
        UPDATE fleets
        SET
          target_id = $2
        , state = $3
        , is_attacking = $4
        , warp_time = 6
        , from_home = 0
        WHERE id = $1
      `,
      [id, targetId, FleetState.WARP, isAttacking])
    if (updateRes instanceof Error) {
      return showErr(ctx, `Failed to update fleet ${id}: ${updateRes.message}`, $, 500)
    }

    ctx.redirect(`../fleets/${id}.html`)
  }

/** /rpc/abortMission.html { id } */
export const abortMissionRpc =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`abortMissionRpc`)

    const id = getNumber(ctx.query, 'id')
    if (id === undefined) {
      return showErr(ctx, `No fleet ID`, $, 400)
    }

    const fleetRes = await getFleet(id)
    if (fleetRes instanceof Error) {
      return showErr(ctx, `Failed to get fleet ${id}: ${fleetRes.message}`, $, 500)
    }
    if (fleetRes === undefined) {
      return showErr(ctx, `No such fleet ${id}`, $, 404)
    }
    const fleet = fleetRes

    switch (fleet.state) {
      case FleetState.HOME:
        return showErr(ctx, `Fleet ${id} is at home. No mission to abort.`, $, 400)
      case FleetState.RETURN:
        return showErr(ctx, `Fleet ${id} is returning home. Can't abort.`, $, 400)
    }

    const updateRes = await db.query(`
        UPDATE fleets
        SET
          target_id = NULL
        , state = $2
        , warp_time = $3
        WHERE id = $1
      `,
      [id, FleetState.RETURN, fleet.from_home])
    if (updateRes instanceof Error) {
      return showErr(ctx, `Failed to update fleet ${id}: ${updateRes.message}`, $, 500)
    }

    ctx.redirect(`../fleets/${id}.html`)
  }
