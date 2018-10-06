import * as restify from 'restify'
import { Ctrl } from './Ctrl'
import * as Fleet from '../models/Fleet'

export class FleetsCtrl extends Ctrl {
  constructor(server: restify.Server, model: Fleet.Fleets) {
    super(server, model, 'fleets')
  }
}