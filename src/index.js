import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
/** redux setup */
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux_modules';
import { composeWithDevTools } from 'redux-devtools-extension';

const reduxStore = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
    <BrowserRouter>
        <Provider store={reduxStore}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
