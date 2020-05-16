export const template = `
  /* Body */

  #container {
    color: #222;
    font-family: "Helvetica", "Helvetica Neue", "Tex Gyre Heros", sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.5;
    margin: 0;
    margin-left: auto;
    margin-right: auto;
    max-width: 960px;
    padding: 0;
    text-rendering: optimizeLegibility;
  }

  body {
    padding: 0 1em;
  }

  footer {
    font-size: 80%;
    text-align: center;
  }

  /* Headings */

  h1 {
    font-size: 2.2rem;
    font-weight: 600;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Tex Gyre Heros", "Helvetica Neue", "Helvetica", sans-serif;
    margin: 0;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 0;
  }

  h2 {
    font-size: 1.9rem;
    font-weight: 600;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 600;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  /* Horizontal rules. */

  hr {
    border-bottom: 1px solid black;
    height: 0;
    margin: 1em auto;
    width: 4em;
  }

  /* Lists. */

  ul, ol {
    margin: 0;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 0;
  }

  li {
    margin: 0;
    margin-left: 2rem;
    padding-left: 0rem;
  }

  li > p {
    margin: 0;
    text-indent: 0;
  }

  li > p + p {
    margin-top: 1rem;
  }

  li > ul, li > ol {
    margin: 0;
  }

  ul.inline {
    list-style-type: none;
    margin: 0;
  }

  ul.inline > li {
    display: inline;
    margin: 0;
    margin-left: 0.5rem;
  }

  ul.inline > li:first-of-type {
    margin-left: 0;
  }

  /* Paragraphs. */

  p {
    margin: 0;
    margin-bottom: 1rem;
    padding-left: 0;
    text-align: justify;
    text-indent: 0rem;
  }

  hr + p, table + p, ol + p, ul + p, pre + p {
    text-indent: 0;
  }

  .coord,
  code,
  pre {
    background: none;
  }

  .mono,
  .coord,
  code,
  pre {
    font-family: "Courier Prime", "Fantasque Sans Mono", "PT Mono", "Fira Code", monospace;
  }

  pre {
    line-height: 1.3;
    margin: 0;
    margin-bottom: 1rem;
    margin-left: 3rem;
    margin-top: 1rem;
    padding: 0;
  }

  pre > code {
    padding-left: 0;
    text-indent: 0;
  }

  a {
    color: #0f70ce;
    text-decoration: none;
  }

  a:hover {
    color: #0081FF;
  }

  /* Tables. */

  table {
    border-spacing: 0;
    margin: 0 auto 1rem 0;
    padding: 0;
    width: auto;
  }

  th {
    border-bottom: 2px solid black;
  }

  th,
  td {
    padding: 0.3rem 0.5rem;
  }

  td {
    border-bottom: 1px solid black;
  }

  /* Last cells don't have bottom borders. */
  tr:last-child td {
    border-bottom: none;
  }

  /* Horizontal tables with the header cells on the left. */

  table.horz th {
    text-align: right;
    border-bottom: none;
    border-right: 1px solid black;
  }

  table.horz td {
    border-bottom: none;
  }

  /* Quotes. */

  blockquote {
    border: none;
    border-left: 1px solid #ccc;
    margin-left: 1em;
    margin-top: 1em;
    padding: 0;
    padding-left: 1rem;
  }

  blockquote + p, h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p {
    text-indent: 0;
  }

  blockquote > p {
    text-indent: 0;
  }

  blockquote > p + p {
    margin-top: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  textarea {
    width: 100%;
  }

  label {
    margin-right: 1rem;
    font-weight: 600;
  }

  textarea,
  input {
  }

  input {
    padding: 0.3rem;
    border: 1px solid #888;
    border-radius: 3px;
  }

  textarea {
    padding: 1rem;
  }

  a.button {
    color: initial;
    padding: 0.3rem 0.4rem 0.2rem 0.3rem;
    margin-right: 0.5em;
    background: white;
    border: 1px solid #888;
    font-size: 90%;
    border-radius: 3px;
    cursor: default;
  }

  /* Loose classes */

  .attacking {
    border-color: #c64444;
    color: #c64444;
  }

  .defending {
    border-color: #408440;
    color: #408440;
  }

  .center {
    text-align: center;
  }

  .right {
    text-align: right;
  }

  .debug {
    color: #AAA;
    font-size: 70%;
  }
`
