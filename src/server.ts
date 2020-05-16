// This module defines the HTTP server that allows viewing pages, reading data,
// and writing data.
//
// Functions:
// - Create server
// - Show err

import Koa from 'koa'
import mount from 'koa-mount'
import Router from 'koa-router'
import serve from 'koa-static'
import { render as renderError } from './html/error'
import { template as intro } from './html/intro'
import * as ClusterCtrl from './http/clusters'
import * as FleetCtrl from './http/fleets'
import * as PlanetCtrl from './http/planets'
import * as StarCtrl from './http/stars'
import * as UserCtrl from './http/user'
import { Logger, stampLog } from './log'

const log = stampLog(`server`)

export type Ctx = Koa.ParameterizedContext<any, {}>

type KoaServer = Promise<Koa<any, {}>>

const ErrorDesc: { [key: number]: string } = {
  400: `Bad parameters`,
  403: `Not allowed`,
  404: `Not found`,
  500: `Program error`,
}

export const createServer =
  async (prefix = ''): KoaServer => {
    const $ = log(`createServer`)

    const app = new Koa()
    let router = new Router()

    app.use(mount(`${prefix}/images`, serve(`images`)))
    bindRoutes(router, prefix)
    app.use(router.routes())

    return app
  }

const bindRoutes =
  (router: Router, prefix: string) => {
    router.get(prefix, ctx => {
      ctx.type = 'html'
      ctx.body = intro
    })

    router.get(`${prefix}/clusters.html`, ClusterCtrl.getClusters)
    router.get(`${prefix}/clusters/:idx.html`, ClusterCtrl.getClustersByIdx)

    router.get(`${prefix}/stars/:id.html`, StarCtrl.getStarById)

    router.get(`${prefix}/planets/new.html`, PlanetCtrl.getNewPlanetForm)
    router.get(`${prefix}/planets/:id.html`, PlanetCtrl.getPlanetById)
    router.get(`${prefix}/rpc/create-planet.html`, PlanetCtrl.createPlanetRpc)

    router.get(`${prefix}/fleets/new.html`, FleetCtrl.getNewFleetForm)
    router.get(`${prefix}/fleets/:id.html`, FleetCtrl.getFleetById)
    router.get(`${prefix}/rpc/create-fleet.html`, FleetCtrl.createFleetRpc)
    router.get(`${prefix}/rpc/send-fleet.html`, FleetCtrl.sendFleetRpc)
    router.get(`${prefix}/rpc/abort-mission.html`, FleetCtrl.abortMissionRpc)

    router.get(`${prefix}/login.html`, UserCtrl.getLoginForm)
    router.get(`${prefix}/rpc/login.html`, UserCtrl.login)

    router.get(`${prefix}/military.html`, UserCtrl.getMilitary)
    router.get(`${prefix}/production.html`, UserCtrl.getProduction)
  }


/** Log and show an error page with the given message and HTTP response code. */
export const showErr =
  (ctx: Ctx, msg: string, logger: Logger, code = 500): void => {
    logger(msg)
    ctx.status = code
    ctx.type = 'html'
    ctx.body = renderError(`${ErrorDesc[code]} (${code})`, msg)
  }
