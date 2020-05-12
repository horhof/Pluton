import { template as page } from './page'

export const template = page
  .replace(`<!-- title -->`, 'Pluton')
  .replace(`<!-- content -->`, `
    <h1 class="center">Pluton</h1>
    <p class="center">
      <img src="images/planet.png"/>
    </p>
    <ul class="center">
      <li>
        <a href="planets/new.html?star_id=1">Create</a> a new planet.
      </li>
      <li>
        <a href="clusters.html">View</a>
        the universe.
      </li>
    </ul>
  `)
