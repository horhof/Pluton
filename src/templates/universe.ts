import { template as page } from './page'
import { stampLog } from '../log'
import { join } from 'path'

const log = stampLog(`html:universe`)

export const render =
  (clusters: any[]): string => {
    const $ = log(`render`)

    $(`Clusters=%o`, clusters)
    const clusterStr = clusters
      .map(index => `<li><a href="../clusters/${index}.html">${index}</li>`)
      .join('')

    return page
      .replace(`<!-- title -->`, 'Universe')
      .replace(`<!-- content -->`, `
        <style>
          .clusters li {
            display: inline-block;
            width: 50px;
            height: 50px;
            line-height: 50px;
            border: 1px solid #888;
            text-align: center;
            margin: 0.5rem;
            border-radius: 3px;
          }
        </style>
        <h1>Universe clusters</h1>
        <ol class="clusters">
          ${clusterStr}
        </ol>
      `)
  }
