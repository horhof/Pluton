import koaBody from 'koa-body'
import Router from 'koa-router'
import * as FleetCtrl from './controllers/FleetCtrl'
import * as PlanetCtrl from './controllers/PlanetCtrl'
import * as StarCtrl from './controllers/StarCtrl'

const bind =
  (router: Router, prefix: string) => {
    router.get(`${prefix}/clusters/:index.html`, StarCtrl.readCluster)
    router.get(`${prefix}/stars/:id.html`, StarCtrl.readStar)
    router.get(`${prefix}/planets/new.html`, PlanetCtrl.createPlanetForm)
    router.post(`${prefix}/planets/new.json`, koaBody(), PlanetCtrl.createPlanet)
    router.get(`${prefix}/planets/:id.html`, PlanetCtrl.readPlanet)
    router.get(`${prefix}/fleets/:id.html`, FleetCtrl.readFleet)
  }

export default bind
