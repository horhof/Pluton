import { getLog } from '../Logger'
const debug = getLog(`Ctrl:Users`)
debug

import * as the from 'lodash'
import * as restify from 'restify'
import { Request as Req, Response as Res } from 'restify'

import { Users } from '../models/User'

export default class UsersCtrl {
  constructor(
    private server: restify.Server,
    private model: Users
  ) {
    this.server.get('/users', this.listUsers.bind(this))
    this.server.get('/users/:id', this.getUser.bind(this))
    this.server.post('/users', this.createUser.bind(this))
    /*
    this.server.put('/users/:id', this.updateUser.bind(this))
    this.server.del('/users/:id', this.deleteUser.bind(this))
    */
  }

  private listUsers(_: Req, res: Res) {
    debug(`List Users>`)
    this.model.getAll()
      .then(data => {
        if (data)
          res.json(200, data)
        else
          res.json(404)
      })
  }

  private getUser(req: Req, res: Res) {
    debug(`Get User>`)
    const { id } = req.params
    this.model.getById(id)
      .then(data => {
        if (data)
          res.json(200, data)
        else
          res.json(404)
      })
  }

  private createUser(req: Req, res: Res) {
    debug(`Create user>`)
    const data = the(req.body)
      .pick([
        'name',
      ])
      .value()

    this.model.add(data)
      .then(data => {
        res.json(200, data)
      })
  }
}