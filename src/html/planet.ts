import { template as page } from './page'
import { stampLog } from '../log'
import { PlanetNav } from '../data/planet'
import { Star } from '../data/star'
import { Fleet } from '../data/fleet'

const log = stampLog(`html:planet`)

export const render =
  (planet: PlanetNav, star: Star, fleets: Fleet[]): string => {
    const $ = log(`render`)

    const prevHtml = planet.prev_id === undefined ? '' : `
      <tr>
        <th>Previous</th>
        <td>
          <a href="${planet.prev_id}.html">${planet.prev_name}</a>
          (${star.cluster}:${star.index}:${planet.prev_index})
        </td>
      </tr>
    `
    const nextHtml = planet.next_id === undefined ? '' : `
      <tr>
        <th>Next</th>
        <td>
          <a href="${planet.next_id}.html">${planet.next_name}</a>
          (${star.cluster}:${star.index}:${planet.next_index})
        </td>
      </tr>
    `

    let fleetStr = '<p>None.</p>'
    if (fleets.length > 0) {
      const fleetRows = fleets
        .map(f => `
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
        .join('')
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
      .replace(`<!-- title -->`, `${planet.name}`)
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
            ${prevHtml}
            ${nextHtml}
          </tbody>
        </table>
        <h2>Fleets</h2>
          ${fleetStr}
        <p>
          <a class="button" href="../fleets/new.html?planet_id=${planet.id}">Create</a>
        </p>
      `)
  }
