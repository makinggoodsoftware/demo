import css from '../components/base.css'  // triggers Webpack to process the file #TODO: return JSX below instead of string

export default function renderFullPage(html, preloadedState) {
    return `
    <!doctype html>
    <html>
      <head>
        <title>Tonicmart</title>
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