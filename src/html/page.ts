import { template as css } from './stylesheet'
import { template as js } from './common'

interface PageArgs {
  content?: string
  title?: string
  head?: string
  css?: string
}

export const render =
  (input: PageArgs = {}): string => `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <meta charset="utf-8"/>
        <link rel="apple-touch-icon" sizes="57x57" href="/images/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/images/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/images/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/images/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/images/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/images/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
        <link rel="manifest" href="/images/manifest.json">
        <style type="text/css">
          ${css}
          ${input.css || ''}
        </style>
        <meta name="viewport" content="width=device-width"/>
        ${input.title ? '<title>' + input.title + '</title>' : ''}
        <script>
          ${js}
        </script>
        ${input.head || ''}
      </head>
      <body>
        <div id="container">
          ${input.content || ''}
          <footer>
            <a href="/">Home</a>
          </footer>
        </div>
      </body>
    </html>
  `;

export const template =
  render({
    title: `<!-- title -->`,
    content: `<!-- content -->`,
  })
