import { Planet } from '../data/planet'
import { StarNav } from '../data/star'
import { stampLog } from '../log'
import { template as page } from './page'

const log = stampLog(`html:star`)

export const render =
  (star: StarNav, planets: Planet[]): string => {
    const $ = log(`render`)

    const nextHtml = star.next_id === undefined ? '' : `
      <tr>
        <th>Next</th>
        <td>
          <a href="${star.next_id}.html">${star.next_name}</a>
          (<span class="coord">${star.cluster}:${star.next_index}</span>)
        </td>
      </tr>
    `
    const prevHtml = star.prev_id === undefined ? '' : `
      <tr>
        <th>Previous</th>
        <td>
          <a href="${star.prev_id}.html">${star.prev_name}</a>
          (<span class="coord">${star.cluster}:${star.prev_index}</span>)
        </td>
      </tr>
    `

    const planetsHtml = planets.length < 1 ? '<p>None.</p>' : '<ol>' + planets
      .map(p =>
        `<li><a href="../planets/${p.id}.html">${p.name}</a></li>`)
      .join('') + '</ol>'

    return page
      .replace(`<!-- title -->`, `${star.name}`)
      .replace(`<!-- content -->`, `
        <h1>${star.name}</h1>
        <table class="horz">
          <tbody>
            <tr>
              <th>ID</th>
              <td class="coord">
                <a href="../stars/${star.id}.html">/stars/${star.id}.html</a>
              </td>
            </tr>
            <tr>
              <th>Coords</th>
              <td class="coord">
                <a href="../clusters/${star.cluster}.html">${star.cluster}</a>:${star.index}
              </td>
            </tr>
            ${prevHtml}
            ${nextHtml}
          </tbody>
        </table>
        <h2>Planets</h2>
          ${planetsHtml}
        <p>
          <a class="button" href="../planets/new.html?star_id=${star.id}">Create</a>
        </p>
      `)
  }
