import * as the from 'lodash'
import { Request as Req, Response as Res } from 'restify'

import { getLog } from '../Logger'

const debug = getLog(`Http`)
export enum Code {
  OK = 200,
  BAD_REQ = 400,
  NOT_FOUND = 404,
  SERVER_ERR = 500,
}

export abstract class Ctrl {
  protected uri!: string

  protected abort(res: Res, code = Code.SERVER_ERR) {
    return function(err: Error) {
      debug(`[Ctrl] Abort> Message=%o Error=%O`, err.message, err)
      res.json(code, { message: err.message })
    }
  }

  protected getPlayerId(req: Req) {
    return the(req.header('X-API-Key')).toNumber()
  }

  /**
   * Abort the request if an ID parameter in the URI isn't valid, else return
   * the ID.
   *
   * Consumers are intended to check this return for an undefined value and then
   * just return as the request has already been terminated.
   */
  protected checkId(req: Req, res: Res, key = 'id'): number | undefined {
    let id: any = the(req).get(`params.${key}`)
    id = Number(id)
    if (!the(id).isNumber()) {
      this.abort(res, Code.BAD_REQ)(new Error(`The ID '${id}' isn't valid.`))
      return
    }
    return Number(id)
  }
}