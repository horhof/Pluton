import { getLog } from './Logger'
const debug = getLog(`Game`)
debug

// @ts-ignore
import * as the from 'lodash'
import * as restify from 'restify'
import * as Sequelize from 'sequelize'

const sequelize = new Sequelize('pluton', 'pluton', 'password', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

const User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync()
  .then(() => User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  }))
  .then(jane => {
    console.log(jane);
  });

export class Game {
  //db: Data
  db: any

  server: restify.Server

  //private controllers: { [name: string]: any } = {}

  constructor() {
    //this.db = new Data()

    debug(`New> Spinning up server...`)
    this.server = restify.createServer()
    this.server.use(restify.plugins.bodyParser())

    /*
    debug(`New> Connecting static resources...`);
    this.server.get(/^\/ui/, restify.plugins.serveStatic({
      directory: __dirname + '\\..',
      default: 'index.html'
    }));
    */

    //this.controllers.users = new UsersCtrl(this.server, this.db.users)
    //this.controllers.fleets = new FleetsCtrl(this.server, this.db.fleets)

    debug(`New> Done.`);
  }

  async start() {
    return new Promise<void>(resolve => {
      this.server.listen(8192, '127.0.0.1', () => {
        debug(`Init> Server started.`)
        resolve()
      })
    })
  }

  /*
  tick() {
    // For each fleet not in its target location, move it.
    const fleets = await this.db.fleets.getAll()
    the(fleets).forEach(f => {
    })
  }
  */
}