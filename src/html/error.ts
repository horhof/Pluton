import { template as page } from './page'
import { stampLog } from '../log'

const log = stampLog(`html:error`)

export const render =
  (title: string, msg: string): string => page
    .replace(`<!-- title -->`, `${title}`)
    .replace(`<!-- content -->`, `
      <h1>${title}</h1>
      <p>${msg}</p>
    `)
