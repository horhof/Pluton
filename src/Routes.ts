import koaBody from 'koa-body'
import Router from 'koa-router'
import * as ClusterCtrl from './controllers/ClusterCtrl'
import * as FleetCtrl from './controllers/FleetCtrl'
import * as PlanetCtrl from './controllers/PlanetCtrl'
import * as StarCtrl from './controllers/StarCtrl'
import { stampLog } from './Log'
import { Ctx } from './Server'
import { template as intro } from './templates/intro'

const log = stampLog(`Router`)

const bind =
  (router: Router, prefix: string) => {
    router.get(prefix, ctx => {
      ctx.type = 'html'
      ctx.body = intro
    })

    router.get(`${prefix}/clusters.html`, ClusterCtrl.readClusters)
    router.get(`${prefix}/clusters/:index.html`, ClusterCtrl.readCluster)

    router.get(`${prefix}/stars/:id.html`, StarCtrl.readStar)

    router.get(`${prefix}/planets/new.html`, PlanetCtrl.planetsNew)
    router.get(`${prefix}/planets/create.html`, PlanetCtrl.planetsCreate)
    router.get(`${prefix}/planets/:id.html`, PlanetCtrl.planetsId)

    router.get(`${prefix}/fleets/new.html`, FleetCtrl.createFleetForm)
    router.get(`${prefix}/fleets/create.html`, FleetCtrl.fleetsCreate)
    router.get(`${prefix}/fleets/:id.html`, FleetCtrl.readFleet)
    router.put(`${prefix}/fleets/:id.json`, koaBody(), FleetCtrl.updateFleet)
  }

export default bind
