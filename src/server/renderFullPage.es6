import css from '../components/base.css'

export default function renderFullPage(html, preloadedState) {
    return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
        <link rel="stylesheet" href="assets/styles.css" />
        <link href="https://fonts.googleapis.com/css?family=Titillium+Web:200|Titillium+Web:300|Josefin+Sans" rel="stylesheet" type='text/css' />
      </head>
      <body>
        <div id="content">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="assets/bundle.js"></script>
      </body>
    </html>
    `
}