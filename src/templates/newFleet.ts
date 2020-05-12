import { template as page } from './page'
import { Planet } from '../models/Planet'

export const render =
  (planet: Planet): string => page
    .replace(`<!-- title -->`, 'Create fleet')
    .replace(`<!-- content -->`, `
      <h1>Create fleet</h1>
      <div class="form-group">
        <p>
          <label>Name</label>
          <input id="name" value="New fleet" oninput="update()"/>
        </p>
        <p>
          <label>Planet</label>
          <a href="../planets/${planet.id}.html">${planet.name}</a>
        </p>
      </div>
      <p>
        <a id="createLink" href="create.html">Create</a>
      </p>
      <script>
        const update = () => {
          const createLink = getId('createLink')
          const name = getValue('name')
          createLink.href = makeUrl('create.html', { planet_id: ${planet.id}, name })
        }
        update()
      </script>
    `)
