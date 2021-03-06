import { render as renderPage, template as page } from './page'
import { stampLog } from '../log'
import { PlanetNav } from '../data/planet'
import { Star } from '../data/star'
import { Fleet } from '../data/fleet'

const log = stampLog(`html:planet`)

export const render =
  (planet: PlanetNav, star: Star, fleets: Fleet[], userPlanetId: any): string => {
    const $ = log(`render`)

    let prefetch = `
      <link rel="prefetch" href="../stars/${planet.star_id}.html">
    `
    if (planet.prev_id) {
      prefetch += `<link rel="prefetch" href="${planet.prev_id}.html">`
    }
    if (planet.next_id) {
      prefetch += `<link rel="prefetch" href="${planet.next_id}.html">`
    }

    const prevHtml = planet.prev_id === undefined ? '' : `
      <tr>
        <th>Previous</th>
        <td>
          <a href="${planet.prev_id}.html">${planet.prev_name}</a>
          (<span class="coord">${star.cluster}:${star.index}:${planet.prev_index}</span>)
        </td>
      </tr>
    `
    const nextHtml = planet.next_id === undefined ? '' : `
      <tr>
        <th>Next</th>
        <td>
          <a href="${planet.next_id}.html">${planet.next_name}</a>
          (<span class="coord">${star.cluster}:${star.index}:${planet.next_index}</span>)
        </td>
      </tr>
    `

    let fleetsSectionHtml = '<p>None.</p>'
    if (fleets.length > 0) {
      const fleetRows = fleets
        .map(f => `
          <tr>
            <td class="center">${f.index}</td>
            <td>
              <a href="../fleets/${f.id}.html">${f.name}</a>
            </td>
            <td class="center">
            ${f.is_attacking
              ? '<span class="attacking">Attack</span>'
              : '<span class="defending">Defend</span>'}
            </td>
          </tr>`)
        .join('')
      fleetsSectionHtml = `
        <table>
          <thead>
            <tr>
              <th class="center">No.</th>
              <th>Name</th>
              <th class="center">Mission</th>
            </tr>
          </thead>
          <tbody>
            ${fleetRows}
          </tbody>
        </table>
      `
    }
    let adminHtml = userPlanetId !== planet.id ? '' : `
      <tr>
          <th>Admin</th>
          <td>
            <ul class="inline">
              <li><a href="../military.html">Military</a></li>
              <li><a href="../production.html">Production</a></li>
            </ul>
          </td>
        </tr>
      `

    return renderPage({
      title: planet.name,
      head: `
        ${prefetch}
      `,
      content: `
        <h1>${planet.name}</h1>
        <table class="horz">
          <tbody>
            <tr>
              <th>ID</th>
              <td class="coord">
                <a href="../planets/${planet.id}.html">/planets/${planet.id}.html</a>
              </td>
            </tr>
            <tr>
              <th>Coords</th>
              <td class="coord">
                <a href="../clusters/${star.cluster}.html">${star.cluster}</a>:<a href="../stars/${star.id}.html">${star.index}</a>:${planet.index}
              </td>
            </tr>
            <tr>
              <th>Ruler</th>
              <td>${planet.ruler}</td>
            </tr>
            <tr>
              <th>Star system</th>
              <td>
                <a href="../stars/${star.id}.html">${star.name}</a>
              </td>
            </tr>
            ${prevHtml}
            ${nextHtml}
            ${adminHtml}
          </tbody>
        </table>
      `
    })
  }
