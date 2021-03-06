import { template as page } from './page'
import { Planet } from '../data/planet'

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
        <a class="button" id="create-fleet">Create</a>
      </p>
      <script>
        const update = () => {
          const createFleet = getId('create-fleet')
          const name = getValue('name')
          createFleet.href = makeUrl('../rpc/create-fleet.html', { planet_id: ${planet.id}, name })
        }
        update()
      </script>
    `)
