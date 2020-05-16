import { template as page } from './page'

export const template = page
  .replace(`<!-- title -->`, 'Pluton')
  .replace(`<!-- content -->`, `
    <h1>Pluton</h1>
    <p>
      <img src="data:image/png;base64,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"/>
    </p>
    <ul>
      <li>
        <a href="planets/new.html?star_id=1">Create</a> a new planet.
      </li>
      <li>
        <a href="clusters.html">View</a>
        the universe.
      </li>
      <li>
        View <a href="planet.html">your planet</a> or <a href="login.html">login</a>.
      </li>
    </ul>
  `)
