import { template as page } from './page'
import { stampLog } from '../log'
import { Planet } from '../models/planet'
import { Star } from '../models/star'
import { Fleet, FleetState } from '../models/fleet'

const log = stampLog(`html:fleet`)

export const render =
  (fleet: Fleet, planet: Planet, target: Planet | null): string => {
    const $ = log(`render`)

    const targetStr = target === null ? '' : `
      <tr>
        <th>Target</th
        <td>
          <a href="../planets/${target.id}.html">${target.name}</a>
        </td>
      </tr>
      <tr>
        <td>Warp ETA</td>
        <td>${fleet.warp_time - fleet.from_home}</td>
      </tr>
    `

    return page
      .replace(`<!-- title -->`, `${fleet.name} fleet`)
      .replace(`<!-- content -->`, `
        <h1>${fleet.name} fleet</h1>
        <table class="horz">
          <tbody>
            <tr>
              <th>ID</th>
              <td class="id">
                <a href="../fleets/${fleet.id}.html">/fleets/${fleet.id}.html</a>
              </td>
            </tr>
            <tr>
              <th>Planet</th>
              <td>
                <a href="../planets/${planet.id}.html">${planet.name}</a>
              </td>
            </tr>
            <tr>
              <th>Ships</th>
              <td>${fleet.ships}</td>
            </tr>
            <tr>
              <th>Warping</th>
              <td>${fleet.state === FleetState.WARP ? 'Yes' : 'No'}</td>
            </tr>
            ${targetStr}
          </tbody>
        </table>
        <h2>Edit</h2>
        <p>WIP</p>
        <h2>Send</h2>
        <p>WIP</p>
      `)
  }
