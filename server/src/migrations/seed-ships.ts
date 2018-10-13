import * as sequelize from 'sequelize'
import { getLog } from '../Logger'

const debug = getLog(`Db`)

export const up = async (sequelize: sequelize.Sequelize) => {
  debug(`Seeding ships...`)
  const query = sequelize.getQueryInterface()
  await query.bulkInsert('ships', [
    {
      class: 'F',
      designation: 14,
      name: 'Interceptor',
      equipmentCost: 1000,
      organicsCost: 0,
      fuelCost: 0,
    },
    {
      class: 'F',
      designation: 117,
      name: 'Spider',
      equipmentCost: 0,
      organicsCost: 1000,
      fuelCost: 0,
    },
    {
      class: 'P',
      designation: 38,
      name: 'Phoenix',
      equipmentCost: 2000,
      organicsCost: 1000,
      fuelCost: 0,
    },
    {
      class: 'P',
      designation: 51,
      name: 'Wraith',
      equipmentCost: 1500,
      organicsCost: 1500,
      fuelCost: 0,
    },
    {
      class: 'A',
      designation: 10,
      name: 'Astropod',
      equipmentCost: 2000,
      organicsCost: 1000,
      fuelCost: 0,
    },
    {
      class: 'A',
      designation: 4,
      name: 'War frigate',
      equipmentCost: 5500,
      organicsCost: 1500,
      fuelCost: 0,
    },
    {
      class: 'A',
      designation: 6,
      name: 'Black widow',
      equipmentCost: 2000,
      organicsCost: 5000,
      fuelCost: 0,
    },
    {
      class: 'D',
      designation: 25,
      name: 'Devastator',
      equipmentCost: 12000,
      organicsCost: 4000,
      fuelCost: 0,
    },
    {
      class: 'D',
      designation: 31,
      name: 'Ghost',
      equipmentCost: 8000,
      organicsCost: 8000,
      fuelCost: 0,
    },
    {
      class: 'C',
      designation: 130,
      name: 'Star cruiser',
      equipmentCost: 18000,
      organicsCost: 8000,
      fuelCost: 0,
    },
    {
      class: 'C',
      designation: 5,
      name: 'Tarantula',
      equipmentCost: 6000,
      organicsCost: 18000,
      fuelCost: 0,
    },
    {
      class: 'B',
      designation: 17,
      name: 'Dreadnaught',
      equipmentCost: 64000,
      organicsCost: 10000,
      fuelCost: 0,
    },
    {
      class: 'B',
      designation: 2,
      name: 'Spectre',
      equipmentCost: 37000,
      organicsCost: 37000,
      fuelCost: 0,
    },
  ])
}