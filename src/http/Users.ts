import { getLog } from '../Logger'
const debug = getLog(`Http:User`)
debug

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'

import * as User from '../models/User'

export class UsersCtrl {
  constructor(
    private server: restify.Server,
    private model: User.Users,
  ) {
    this.server.get('/users', this.getUsers.bind(this))
    this.server.get('/users/:id', this.getUsersId.bind(this))
    this.server.post('/users', this.postUsers.bind(this))
  }

  private getUsers(_: Req, res: Res) {
    debug(`GET /users>`)
  }

  private getUsersId(req: Req, res: Res) {
    debug(`GET /users/:id>`)
  }

  private postUsers(req: Req, res: Res) {
    debug(`POST /users>`)
  }
}