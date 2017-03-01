var path = require('path');
var express = require('express');
var app = express();
var handleRender = require('./src/server/handleRender.es6').handleRender
var forceSSL = require('./src/shared/forceSSL.es6');
var routes = require('./src/shared/routes.es6')
var match = require('react-router').match

app.set('port', (process.env.PORT || 3000));

app.use(forceSSL);

app.use('/', express.static(path.join(__dirname, 'public')));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

console.log("==== __dirname = ", __dirname)

app.get('*', (req, res) => {
    // console.log("==== comparing with routes obj: ", routes)
    match(
        { routes, location: req.url },
        (err, redirectLocation, renderProps) => {

            console.log("==== renderProps = ", renderProps)
            console.log("==== location = ", req.url)
            // console.log("==== handleREnder = ", handleRender)

            handleRender(req, res)  // temporary bypass since match is not working...
            return

            // in case of error display the error message
            if (err) {
                return res.status(500).send(err.message);
            }

            // in case of redirect propagate the redirect to the browser
            if (redirectLocation) {
                return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            }

            // generate the React markup for the current route
            var markup;
            if (renderProps) {
                // if the current route matched we have renderProps
                // markup = renderToString(<RouterContext {...renderProps}/>);
                console.log("==== route matched, now handling render")
                handleRender(req, res)

            } else {
                // otherwise we can render a 404 page
                console.log("==== no renderProps :(")
                {/*markup = renderToString(<NotFoundPage/>);*/}
                res.status(404).send('no route match');
            }

            // render the index template with the embedded React markup
            // return res.render('index', { markup });
        }
    );
});


app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
