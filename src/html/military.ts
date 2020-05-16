import { Fleet } from '../data/fleet'
import { Planet } from '../data/planet'
import { stampLog } from '../log'
import { template as page } from './page'

const log = stampLog(`html:military`)

const fleetsSection =
  (planet: Planet, fleets: Fleet[]) => {
    let tableHtml = '<p>None.</p>'
    if (fleets.length > 0) {
      const rows = fleets
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

      tableHtml = `
        <table>
          <thead>
            <tr>
              <th class="center">No.</th>
              <th>Name</th>
              <th class="center">Mission</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `
    }

    return `
      <h2>Fleets</h2>
      ${tableHtml}
      <p>
        <a class="button" href="../fleets/new.html?planet_id=${planet.id}">Create</a>
      </p>
    `
  }

const squadronsSection =
  (planet: Planet) => {
    return `
      <h2>Squadrons</h2>
      <p>
        <a class="button" href="../squadrons/new.html?planet_id=${planet.id}">Create</a>
      </p>
    `
  }

export const render =
  (planet: Planet, fleets: Fleet[]): string => {
    const $ = log(`render`)

    return page
      .replace(`<!-- title -->`, `${planet.name} Military`)
      .replace(`<!-- content -->`, `
        <h1><a href="planets/${planet.id}.html">${planet.name}</a> Military</h1>

        ${fleetsSection(planet, fleets)}

        ${squadronsSection(planet)}
      `)
  }
