import { template as page } from './page'
import { stampLog } from '../Log'

const log = stampLog(`html:error`)

export const render =
  (code: number, msg: string): string => page
    .replace(`<!-- title -->`, `${code} error`)
    .replace(`<!-- content -->`, `
      <h1>${code} error</h1>
      <p>${msg}</p>
    `)
