import { template as page } from './page'

export const template = page
  .replace(`<!-- title -->`, 'Pluton')
  .replace(`<!-- content -->`, `
    <h1>Pluton</h1>
    <p>
      This is a space war game.
      <ul>
        <li>
          <a href="planets/new.html?star_id=1">Create</a> a new planet.
        </li>
        <li>
          <a href="clusters.html">View</a>
          the universe.
        </li>
      </ul>
    </p>
  `)
