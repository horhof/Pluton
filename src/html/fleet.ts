import { Fleet, FleetState } from '../data/fleet'
import { Squadron } from '../data/squadron'
import { Planet } from '../data/planet'
import { stampLog } from '../log'
import { template as page } from './page'

const log = stampLog(`html:fleet`)

export const render =
  (fleet: Fleet, squadrons: Squadron[], planet: Planet, target?: Planet): string => {
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
            <label for="attack">Attack</label>
            <input id="attack" type="radio" name="mission" value="attack" oninput="updateTarget()"/>
          </p>
          <p>
            <label for="defend">Defend</label>
            <input id="defend" type="radio" name="mission" value="defend" oninput="updateTarget()"/>
          </p>
        </div>
        <p>
          <a class="button" id="send-fleet">Send</a>
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
        <a class="button" id="abort-mission" href="../rpc/abort-mission.html?id=${fleet.id}">Abort</a>
      `
    }

    let missionHtml =''
    if (!fleet.is_base) {
      missionHtml = [FleetState.HOME].includes(fleet.state)
        ? `
          <h2>Mission</h2>
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
          ${fleet.state === FleetState.HOME ? 'At home planet' : ''}
          ${fleet.state === FleetState.WARP ? 'Warping to target' : ''}
          ${fleet.state === FleetState.ARRIVED ? 'Arrived at target' : ''}
          ${fleet.state === FleetState.RETURN ? 'Returning from target' : ''}
        </td>
      </tr>
    `

    let squadronHtml = '<p>None.</p>'
    if (squadrons.length > 0) {
      const squadronRows = squadrons
        .map(s => `
          <tr>
            <td class="center">${s.index}</td>
            <td>
              <a href="../squadrons/${s.id}.html">${s.name}</a>
            </td>
            <td class="id right">${s.ships}</td>
          </tr>`)
        .join('')
      squadronHtml = `
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
            ${squadronRows}
          </tbody>
        </table>
      `
    }

    return page
      .replace(`<!-- title -->`, `${fleet.name}`)
      .replace(`<!-- content -->`, `
        <h1>${fleet.name}</h1>
        <table class="horz">
          <tbody>
            <tr>
              <th>ID</th>
              <td class="coord">
                <a href="../fleets/${fleet.id}.html">/fleets/${fleet.id}.html</a>
              </td>
            </tr>
            <tr>
              <th>Planet</th>
              <td>
                <a href="../planets/${planet.id}.html">${planet.name}</a>
              </td>
            </tr>
            ${stateHtml}
          </tbody>
        </table>
        ${missionHtml}
        <h2>Squadrons</h2>
        ${squadronHtml}
        <script>
          const updateTarget = () => {
            const sendFleet = getId('send-fleet')
            const target_id = getValue('target_id')
            const mission = getRadio('mission')
            sendFleet.href = makeUrl('../rpc/send-fleet.html', { id: ${fleet.id}, target_id, mission })
            console.debug('Link=%o', sendFleet.href)
          }
          updateTarget()
        </script>
        `)
  }
