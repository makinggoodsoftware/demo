var path = require('path');
var express = require('express');
var app = express();
import React from 'react'
import { createStore } from 'redux';
import reducers from './src/shared/reducers.es6'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import App from './src/components/app.es6'
import { createMemoryHistory } from 'react-router'
import renderFullPage from './src/server/renderFullPage.es6'
var forceSSL = require('./src/shared/forceSSL.es6');

function handleRender(req, res) {
    // Create a new Redux store instance
    const store = createStore(reducers);
    const history = createMemoryHistory()

    // Render the component to a string
    const html = renderToString(
        <Provider store={store}>
            <App history={ history }/>
        </Provider>
    )

    // Grab the initial state from our Redux store
    const preloadedState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState))
}

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


app.use('/', express.static(path.join(__dirname, 'public')));

app.use(handleRender);

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
