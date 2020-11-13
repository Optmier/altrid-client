import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Router } from 'react-router-dom';
/** redux setup */
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux_modules';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import { createBrowserHistory } from 'history';

const customHistory = createBrowserHistory();
const logger = createLogger();
const reduxStore = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk.withExtraArgument({ history: customHistory }))));
//const reduxStore = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
    <Router history={customHistory}>
        <Provider store={reduxStore}>
            <App />
        </Provider>
    </Router>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
