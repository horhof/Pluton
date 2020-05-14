import { Fleet, FleetState } from '../data/fleet'
import { Planet } from '../data/planet'
import { stampLog } from '../log'
import { template as page } from './page'

const log = stampLog(`html:fleet`)

export const render =
  (fleet: Fleet, planet: Planet, target?: Planet): string => {
    const $ = log(`render`)

    let sendForm =''
    if (!fleet.is_base) {
      sendForm = target !== undefined ? '' : `
        <div class="form-group">
          <p>
            <label>Target</label>
            <input id="target_id" value="" oninput="updateTarget()"/>
          </p>
          <p>
            <label>Mission</label>
            <input id="mission" value="attack" oninput="updateTarget()"/>
          </p>
        </div>
        <p>
          <a class="button" id="sendFleet" href="../rpc/sendFleet.html">Send</a>
        </p>
      `
    }

    let missionInline = 'None.'
    if (target !== undefined) {
      missionInline = `
        <span class="${fleet.is_attacking ? 'attacking' : 'defending'}">
          ${fleet.is_attacking ? 'Attacking' : 'Defending'}
        </span>
        <a href="../planets/${target.id}.html">${target.name}</a>
        <a class="button" id="abortMission" href="../rpc/abortMission.html?id=${fleet.id}">Abort</a>
      `
    }

    let missionHtml =''
    if (!fleet.is_base) {
      missionHtml = [FleetState.HOME].includes(fleet.state)
        ? `
          <h2>Mission</h2>
          <p>None.</p>
          ${sendForm}
        `
        : `
          <h2>Mission</h2>
          <table class="horz">
            <tbody>
              <tr>
                <th>Mission</th>
                <td>${missionInline}</td>
              </tr>
              <tr>
                <th>ETA</th>
                <td>${fleet.warp_time - fleet.from_home}</td>
              </tr>
            </tbody>
          </table>
        `
    }

    const stateHtml = fleet.is_base ? '' : `
      <tr>
        <th>State</th>
        <td>
          ${fleet.state === FleetState.HOME ? 'Home' : ''}
          ${fleet.state === FleetState.WARP ? 'Warping' : ''}
          ${fleet.state === FleetState.ARRIVED ? 'Arrived' : ''}
          ${fleet.state === FleetState.RETURN ? 'Returning' : ''}
        </td>
      </tr>
    `

    return page
      .replace(`<!-- title -->`, `${fleet.name}`)
      .replace(`<!-- content -->`, `
        <h1>${fleet.name}</h1>
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
            ${stateHtml}
          </tbody>
        </table>
        ${missionHtml}
        <script>
          const updateTarget = () => {
            const sendFleet = getId('sendFleet')
            const target_id = getValue('target_id')
            const mission = getValue('mission')
            sendFleet.href = makeUrl('../rpc/sendFleet.html', { id: ${fleet.id}, target_id, mission })
            console.debug('Link=%o', sendFleet.href)
          }
          updateTarget()
        </script>
        `)
  }
