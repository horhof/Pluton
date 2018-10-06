import * as sequelize from 'sequelize'

export const up = (sequelize: sequelize.Sequelize) => {
  const query = sequelize.getQueryInterface()
  query.bulkInsert('ships', [
    {
      class: 'F',
      designation: 5,
      name: 'Interceptor'
    },
    {
      class: 'F',
      designation: 117,
      name: 'Spider'
    },
    {
      class: 'P',
      designation: 38,
      name: 'Phoenix'
    },
    {
      class: 'P',
      designation: 51,
      name: 'Wraith'
    },
    {
      class: 'A',
      designation: 10,
      name: 'Astropod'
    },
    {
      class: 'A',
      designation: 4,
      name: 'War frigate'
    },
    {
      class: 'A',
      designation: 6,
      name: 'Black widow'
    },
    {
      class: 'D',
      designation: 25,
      name: 'Devastator'
    },
    {
      class: 'D',
      designation: 31,
      name: 'Ghost'
    },
    {
      class: 'C',
      designation: 130,
      name: 'Star cruiser'
    },
    {
      class: 'C',
      designation: 5,
      name: 'Tarantula'
    },
    {
      class: 'B',
      designation: 17,
      name: 'Dreadnaught'
    },
    {
      class: 'B',
      designation: 2,
      name: 'Spectre'
    }
  ])
};