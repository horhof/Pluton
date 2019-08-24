import koaBody from 'koa-body'
import Router from 'koa-router'
import * as ClusterCtrl from './controllers/ClusterCtrl'
import * as FleetCtrl from './controllers/FleetCtrl'
import * as PlanetCtrl from './controllers/PlanetCtrl'
import * as StarCtrl from './controllers/StarCtrl'
import { stampLog } from './Log'
import { Ctx } from './Server'

const log = stampLog(`Router`)

const bind =
  (router: Router, prefix: string) => {
    router.get(prefix, readIntro)

    router.get(`${prefix}/clusters.html`, ClusterCtrl.readClusters)
    router.get(`${prefix}/clusters/:index.html`, ClusterCtrl.readCluster)

    router.get(`${prefix}/stars/:id.html`, StarCtrl.readStar)

    router.get(`${prefix}/planets/new.html`, PlanetCtrl.createPlanetForm)
    router.post(`${prefix}/planets/new.json`, koaBody(), PlanetCtrl.createPlanet)
    router.get(`${prefix}/planets/:id.html`, PlanetCtrl.readPlanet)

    router.get(`${prefix}/fleets/new.html`, FleetCtrl.createFleetForm)
    router.post(`${prefix}/fleets/new.json`, koaBody(), FleetCtrl.createFleet)
    router.get(`${prefix}/fleets/:id.html`, FleetCtrl.readFleet)
    router.put(`${prefix}/fleets/:id.json`, koaBody(), FleetCtrl.updateFleet)
  }

const readIntro =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readIntro`)
    const template = require('./templates/Intro.marko')
    ctx.type = 'html'
    ctx.body = template.stream()
  }

export default bind
