import { getLog } from '../Logger'
const debug = getLog(`Ctrl:Users`)
debug

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'

import { Users } from '../models/User'

export class UsersCtrl {
  constructor(
    private server: restify.Server,
    private model: Users
  ) {
    this.server.get('/users', this.getUsers.bind(this))
    this.server.get('/users/:id', this.getUsersId.bind(this))
    this.server.post('/users', this.postUsers.bind(this))
    /*
    this.server.put('/users/:id', this.updateUser.bind(this))
    this.server.del('/users/:id', this.deleteUser.bind(this))
    */
  }

  private getUsers(_: Req, res: Res) {
    debug(`GET /users>`)
    this.model.getAll()
      .then(data => {
        if (data)
          res.json(200, data)
        else
          res.json(404)
      })
  }

  private getUsersId(req: Req, res: Res) {
    debug(`GET /users/:id>`)
    const { id } = req.params
    this.model.getById(id)
      .then(data => {
        if (data)
          res.json(200, data)
        else
          res.json(404)
      })
  }

  private postUsers(req: Req, res: Res) {
    debug(`POST /users>`)
    const name = the(req).get('body.name')
    this.model.createNewUser(name)
      .then(data => {
        res.json(200, data)
      })
  }
}