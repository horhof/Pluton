import * as restify from 'restify'
import { Ctrl } from './Controller'
import * as User from '../models/User'

export class UsersCtrl extends Ctrl {
  constructor(server: restify.Server, model: User.Users) {
    super(server, model, 'users')
  }
}