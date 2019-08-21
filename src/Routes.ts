import Router from 'koa-router'
import koaBody from 'koa-body'
import * as PlanetCtrl from './controllers/PlanetCtrl'
import * as StarCtrl from './controllers/StarCtrl'

const bind =
  (router: Router, prefix: string) => {
    router.get(`${prefix}/planets/new.html`, PlanetCtrl.createPlanetForm)
    router.post(`${prefix}/planets/new.json`, koaBody(), PlanetCtrl.createPlanet)
    router.get(`${prefix}/planets/:id.html`, PlanetCtrl.readPlanet)

    router.get(`${prefix}/stars/:id.html`, StarCtrl.readStar)

    router.get(`${prefix}/clusters/:index.html`, StarCtrl.readCluster)
  }

export default bind
