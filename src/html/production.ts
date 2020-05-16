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
          <tr><th>Type</th><th>Mineral</th><th>Chemical</th><th>Radioactive</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Asteroids</td>
            <td class="mono right">${planet.asteroid_m}</td>
            <td class="mono right">${planet.asteroid_c}</td>
            <td class="mono right">${planet.asteroid_r}</td>
          </tr>
          <tr>
            <td>Resources</td>
            <td class="mono right">${planet.resource_m}</td>
            <td class="mono right">${planet.resource_c}</td>
            <td class="mono right">${planet.resource_r}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>Ship</th>
            <th>Minerals</th>
            <th>Chemicals</th>
            <th>Radioactive</th>
            <th>Number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="center">F-14</td>
            <td class="mono right">110</td>
            <td class="mono right">0</td>
            <td class="mono right">0</td>
            <td><input id="f14" value="0" oninput="update()"/></td>
          </tr>
          <tr>
            <td class="center">Mi-0</td>
            <td class="mono right">110</td>
            <td class="mono right">0</td>
            <td class="mono right">0</td>
            <td><input id="mi0" value="0" oninput="update()"/></td>
          </tr>
        </tbody>
      </table>

      <p>
        <a id="build-ships" class="button" href="">Build</a>
      </p>

      <script>
        const update = () => {
          const buildShips = getId('build-ships')
          const f14 = getValue('f14') || undefined
          const mi0 = getValue('mi0') || undefined
          buildShips.href = makeUrl('../rpc/build-ships.html', {
            f14,
            mi0,
          })
        }
        update()
      </script>

      <!--
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
      -->
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
