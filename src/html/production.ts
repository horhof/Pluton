import { Fleet } from '../data/fleet'
import { Planet } from '../data/planet'
import { stampLog } from '../log'
import { template as page } from './page'

const log = stampLog(`html:production`)

const economy =
  (planet: Planet) => {
    return `
      <h2>Economy</h2>
      <table>
        <thead>
          <tr><th>Type</th><th>Asteroids</th><th>Resources</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="center">Mineral</td>
            <td class="id right">${planet.asteroid_m}</td>
            <td class="id right">${planet.resource_m}</td>
          </tr>
          <tr>
            <td class="center">Chemical</td>
            <td class="id right">${planet.asteroid_c}</td>
            <td class="id right">${planet.resource_c}</td>
          </tr>
          <tr>
            <td class="center">Radioactive</td>
            <td class="id right">${planet.asteroid_r}</td>
            <td class="id right">${planet.resource_r}</td>
          </tr>
        </tbody>
      </table>
    `
  }

export const render =
  (planet: Planet, fleets: Fleet[]): string => {
    const $ = log(`render`)

    return page
      .replace(`<!-- title -->`, `${planet.name} Production`)
      .replace(`<!-- content -->`, `
        <h1><a href="planets/${planet.id}.html">${planet.name}</a> Production</h1>
        ${economy(planet)}
      `)
  }
