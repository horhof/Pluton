import { template as page } from './page'
import { stampLog } from '../Log'
import { Planet } from '../models/Planet'
import { Star } from '../models/Star'
import { Fleet } from '../models/Fleet'

const log = stampLog(`html:planet`)

export const render =
  (planet: Planet, star: Star, fleets: Fleet[]): string => {
    const $ = log(`render`)
    let fleetStr = ''
    if (fleets.length > 0) {
      const fleetRows = fleets.map(f => `
        <tr>
          <td class="center">${f.index}</td>
          <td>
            <a href="../fleets/${f.id}.html">${f.name}</a>
          </td>
          <td class="id right">${f.ships}</td>
          <td class="center">
          ${f.is_attacking
            ? '<span class="attacking">Attack</span>'
            : '<span class="defending">Defend</span>'}
          </td>
        </tr>`)
    fleetStr = `
      <table>
        <thead>
          <tr>
            <th class="center">No.</th>
            <th>Name</th>
            <th class="right">Ships</th>
            <th class="center">Mission</th>
          </tr>
        </thead>
        <tbody>
          ${fleetRows}
        </tbody>
      </table>
    `
    }

    return page
      .replace(`<!-- title -->`, `Planet ${planet.name}`)
      .replace(`<!-- content -->`, `
        <h1>${planet.name}</h1>
        <table class="horz">
          <tbody>
            <tr>
              <th>ID</th>
              <td class="id">
                <a href="../planets/${planet.id}.html">/planets/${planet.id}.html</a>
              </td>
            </tr>
            <tr>
              <th>Coords</th>
              <td class="id">
                <a href="../clusters/${star.cluster}.html">${star.cluster}</a>:<a href="../stars/${star.id}.html">${star.index}</a>:${planet.index}
              </td>
            </tr>
            <tr>
              <th>Ruler</th>
              <td>${planet.ruler}</td>
            </tr>
            <tr>
              <th>Star</th>
              <td>
                <a href="../stars/${star.id}.html">${star.name}</a>
              </td>
            </tr>
          </tbody>
        </table>
        <h2>Fleets</h2>
          ${fleetStr}
        <p>
          <a href="../fleets/new.html?planet_id=${planet.id}">Create</a>
        </p>
      `)
  }
