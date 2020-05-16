import { template as page } from './page'

export const render =
  (): string => page
    .replace(`<!-- title -->`, `Log in`)
    .replace(`<!-- content -->`, `
      <h1>Log in</h1>
      <div class="form-group">
        <p>
          <label>Username</label>
          <input id="username" oninput="update()"/>
        </p>
        <p>
          <label>Password</label>
          <input id="password" oninput="update()"/>
        </p>
      </div>
      <p>
        <a class="button" id="login">Login</a>
      </p>
      <script>
        const update = () => {
          const login = getId('login')
          const username = getValue('username')
          const password = getValue('password')
          login.href = makeUrl('../rpc/login.html', { username, password })
        }
        update()
      </script>
    `)
