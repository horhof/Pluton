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
import { get } from 'lodash'
import { Logger, stampLog } from './Log'
import bind from './Routes'
require('marko/node-require')

const log = stampLog(`Http`)

export type Ctx = Koa.ParameterizedContext<any, {}>

type KoaServer = Promise<Koa<any, {}>>

export const createServer =
  async (prefix = ''): KoaServer => {
    const $ = log(`createServer`)

    const app = new Koa()
    let router = new Router()

    const staticDir = `${__dirname}/static`
    const isProduction = process.env['NODE_ENV'] === 'production'
    require('lasso').configure({
      plugins: [
        'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
      ],
      urlPrefix: `${prefix}/static`,
      outputDir: staticDir, // Place all generated JS/CSS/etc. files into the "static" dir
      bundlingEnabled: isProduction, // Only enable bundling in production
      minify: isProduction, // Only minify JS and CSS code in production
      fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
    })

    app.use(mount(`${prefix}/static`, serve(staticDir)))
    bind(router, prefix)
    app.use(router.routes())

    app.use(async ctx => {
      // We don't have a favicon.
      if (get(ctx.req, 'url', '').match(/favicon\.ico$/)) return

      $(`No route was matched for this request. Ctx=%O`, ctx)
    })

    return app
  }

/** Log and show an error page with the given message and HTTP response code. */
export const showErr =
  (ctx: Ctx, msg: string, logger: Logger, code = 500): void => {
    logger(msg)
    const template = require('./templates/Error.marko')
    ctx.status = code
    ctx.type = 'html'
    ctx.body = template.stream({ code, msg })
  }

/** Log and send a JSON response with the given message and HTTP response code. */
export const sendErr =
  (ctx: Ctx, msg: string, logger: Logger, code = 500): void => {
    logger(msg)
    ctx.status = code
    ctx.body = { code, msg }
  }
