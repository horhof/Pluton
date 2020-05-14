import { template as page } from './page'
import { stampLog } from '../log'
import { Star } from '../data/star'

const log = stampLog(`html:cluster`)

export const render =
  (idx: number, prev: number | undefined, next: number | undefined, stars: Pick<Star, 'id' | 'name'>[]): string => {
    const $ = log(`render`)

    const starStr = stars
      .map(s => `<li><a href="../stars/${s.id}.html">${s.name}</a></li>`)
      .join('')

    const prevHtml = prev === undefined ? '' : `
      <tr>
        <th>Previous</th>
        <td>
          <a href="${prev}.html">${prev}</a>
        </td>
      </tr>
    `
    const nextHtml = next === undefined ? '' : `
      <tr>
        <th>Next</th>
        <td>
          <a href="${next}.html">${next}</a>
        </td>
      </tr>
    `

    return page
      .replace(`<!-- title -->`, `Cluster ${idx}`)
      .replace(`<!-- content -->`, `
        <h1>Cluster ${idx}</h1>
        <table class="horz">
          <tbody>
            <tr>
              <th>ID</th>
              <td class="id">
                <a href="${idx}.html">/clusters/${idx}.html</a>
              </td>
            </tr>
            ${prevHtml}
            ${nextHtml}
          </tbody>
        </table>
        <h2>Stars</h2>
        <ol>
          ${starStr}
        </ol>
        <div class="debug">
          <pre>${JSON.stringify({ idx, prev, next, stars }, undefined, 2)}</pre>
        </div>
      `)
  }
