import { template as page } from './page'
import { stampLog } from '../log'
import { Star } from '../models/star'

const log = stampLog(`html:cluster`)

export const render =
  (index: number, stars: Pick<Star, 'id' | 'name'>[]): string => {
    const $ = log(`render`)

    const starStr = stars.map(s =>
      `<li><a href="../stars/${s.id}.html">${s.name}</a></li>`)

    return page
      .replace(`<!-- title -->`, `Cluster ${index}`)
      .replace(`<!-- content -->`, `
        <h1>Cluster ${index}</h1>
        <table class="horz">
          <tbody>
            <tr>
              <th>ID</th>
              <td class="id">
                <a href="${index}.html">/clusters/${index}.html</a>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          View
          <a href="../clusters.html">all clusters</a>.
        </p>
        <h2>Stars</h2>
        <ol>
          ${starStr}
        </ol>
      `)
  }
