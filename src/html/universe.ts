import { stampLog } from '../log'
import { template as page } from './page'

const log = stampLog(`html:universe`)

export const render =
  (clusters: { idx: number, starCount: number }[]): string => {
    const $ = log(`render`)

    $(`Clusters=%o`, clusters)
    const clusterHtml = `
        <table>
          <thead><tr><th>Cluster</th><th>Stars</th></thead>
          <tbody>
      ` + clusters.map(({ idx, starCount: size }) => `
        <tr>
          <td class="center">
            <a href="../clusters/${idx}.html">${idx}</a>
          </td>
          <td class="center">
            ${size}
          </td>
        </tr>
      `).join('') + `
          </tbody>
        </table>
      `

    return page
      .replace(`<!-- title -->`, 'Universe')
      .replace(`<!-- content -->`, `
        <h1>Universe clusters</h1>
        ${clusterHtml}
        <div class="debug">
          <pre>${JSON.stringify({ clusters }, undefined, 2)}</pre>
        </div>
      `)
  }
