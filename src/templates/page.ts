import { template as css } from './stylesheet'
import { template as js } from './common'

export const template = `
  <!DOCTYPE html>
  <html lang="en-US">
    <head>
      <meta charset="utf-8"/>
      <style type="text/css">
        ${css}
      </style>
      <meta name="viewport" content="width=device-width"/>
      <title>
        <!-- title -->
      </title>
    </head>
    <body>
      <div id="container">
        <!-- content -->
        <footer>
          <a href="/">Home</a>
        </footer>
      </div>
      <script>
        ${js}
      </script>
    </body>
  </html>
`;
