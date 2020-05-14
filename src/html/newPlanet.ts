import { Star } from '../data/star'
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
      <p>
        <a class="button" id="createPlanet" href="../rpc/createPlanet.html">Create</a>
      </p>
      <div class="debug">
        <h2>Debug</h2>
        <pre>${JSON.stringify(star, undefined, 2)} </pre>
      </div>
      <script>
        const update = () => {
          const createPlanet = getId('createPlanet')
          const name = getValue('name')
          const ruler = getValue('ruler')
          createPlanet.href = makeUrl('../rpc/createPlanet.html', { star_id: ${starId}, name, ruler })
          console.debug('Link=%o', createPlanet.href)
        }
        update()
      </script>
    `)
