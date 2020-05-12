import { template as page } from './page'
import { stampLog } from '../log'
import { Planet } from '../models/planet'
import { Star } from '../models/star'
import { Fleet } from '../models/fleet'

const log = stampLog(`html:planet`)

export const render =
  (star: Star, planets: Planet[]): string => {
    const $ = log(`render`)

    const planetStr = planets.length < 1 ? '<p>None.</p>' : '<ol>' + planets
      .map(p =>
        `<li><a href="../planets/${p.id}.html">${p.name}</li>`)
      .join('') + '</ol>'

    return page
      .replace(`<!-- title -->`, `${star.name}`)
      .replace(`<!-- content -->`, `
        <h1>${star.name}</h1>
        <table class="horz">
          <tbody>
            <tr>
              <th>ID</th>
              <td class="id">
                <a href="../stars/${star.id}.html">/planets/${star.id}.html</a>
              </td>
            </tr>
            <tr>
              <th>Coords</th>
              <td class="id">
                <a href="../clusters/${star.cluster}.html">${star.cluster}</a>:${star.index}
              </td>
            </tr>
          </tbody>
        </table>
        <h2>Planets</h2>
          ${planetStr}
        <p>
          <a href="../planets/new.html?star_id=${star.id}">Create</a>
        </p>
      `)
  }
