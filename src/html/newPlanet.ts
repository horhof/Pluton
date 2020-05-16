import { Star } from '../data/star'
import { template as page } from './page'

export const render =
  (starId: number, star: Star): string => page
    .replace(`<!-- title -->`, 'Create planet')
    .replace(`<!-- content -->`, `
      <h1>Create planet</h1>
      <p>
        Username won't be displayed anywhere on the site.
        The password is transmitted over GET requests and is not secure.
      </p>
      <div class="form-group">
        <p>
          <label>Username</label>
          <input id="username" value="" oninput="update()"/>
        </p>
        <p>
          <label>Password</label>
          <input id="password" value="" oninput="update()"/>
        </p>
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
        <a class="button" id="create-planet">Create</a>
      </p>
      <script>
        const update = () => {
          const createPlanet = getId('create-planet')
          const name = getValue('name')
          const ruler = getValue('ruler')
          const username = getValue('username')
          const password = getValue('password')
          createPlanet.href = makeUrl('../rpc/create-planet.html', {
            star_id: ${starId},
            username,
            password,
            name,
            ruler,
          })
        }
        update()
      </script>
    `)
