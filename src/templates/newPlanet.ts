import { Star } from '../models/Star'
import { template as page } from './page'

export const render =
  (starId: number, star: Star): string => page
    .replace(`<!-- title -->`, 'Create planet')
    .replace(`<!-- content -->`, `
      <h1>Create planet</h1>
      <div class="form-group">
        <p>
          <label>Planet name</label>
          <input id="name" value="Planet X" oninput="update()"/>
        </p>
        <p>
          <label>Ruler name</label>
          <input id="ruler" value="Ruler Y" oninput="update()"/>
        </p>
        <p>
          <label>Star</label>
          <a href="../stars/${starId}.html">${star.name}</a>
        </p>
      </div>
      <p><a id="createLink" href="create.html">Create</a></p>
      <div class="debug">
        <h2>Debug</h2>
        <pre>${JSON.stringify(star, undefined, 2)} </pre>
      </div>
      <script>
        const update = () => {
          const createLink = getId('createLink')
          const name = getValue('name')
          const ruler = getValue('ruler')
          createLink.href = makeUrl('create.html', { star_id: ${starId}, name, ruler })
        }
      </script>
    `)
