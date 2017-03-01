import React from 'react'
import { createStore } from 'redux'
import reducers from '../shared/reducers.es6';
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import App from '../components/app.es6'
import { createMemoryHistory } from 'react-router'
import renderFullPage from './renderFullPage.es6'

export function handleRender(req, res) {
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