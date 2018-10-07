import * as the from 'lodash'
import { Request as Req, Response as Res } from 'restify'

export enum Code {
  OK = 200,
  BAD_REQ = 400,
  NOT_FOUND = 404,
  SERVER_ERR = 500,
}

export abstract class Ctrl {
  protected abort(res: Res, code = Code.SERVER_ERR) {
    return function(err: Error) {
      res.json(code, err)
    }
  }

  /** Abort the request if an /:id parameter isn't valid, else return the ID. */
  protected checkId(req: Req, res: Res): number | undefined {
    const id = the(req).get('params.id') as number | undefined
    if (!id) return res.json(Code.BAD_REQ, { message: `Not a valid ID: ${id}.` })
    return id
  }
}