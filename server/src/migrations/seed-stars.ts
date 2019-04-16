import { map } from 'lodash'
import * as sequelize from 'sequelize'
import { getLog } from '../Logger'

const debug = getLog(`Db`)

export const up = async (sequelize: sequelize.Sequelize) => {
  const query = sequelize.getQueryInterface()
  const stars = [
    `Sol`,
    `Alpha Centauri`,
    `Barnard's star`,
    `Luhman 16`,
    `Wolf 359`,
    `Lalande 21185`,
    `Sirius`,
    `Luyten 726-8`,
    `Ross 154`,
    `Omicron Ceti`,
  ]
  debug(`Seeding %d stars...`, stars.length)
  const inserts = map(stars, (name, index) => ({
    cluster: 1,
    name,
    index: index + 1,
  }))
  await query.bulkInsert('stars', inserts)
}