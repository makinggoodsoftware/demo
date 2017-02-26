import { createStore, applyMiddleware } from 'redux';
import { renderToString } from 'react-dom/server'
import reducers from '../shared/reducers.es6';
import App from '../components/app.es6';
import renderFullPage from '../server/renderFullPage.es6'

export default function handleRender(req, res) {
    // Create a new Redux store instance
    const store = createStore(reducers);

    // Render the component to a string
    const html = renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    )

    // Grab the initial state from our Redux store
    const preloadedState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState))
}