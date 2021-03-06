import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import GuideMobileAppStore from './pages/ZZZOthers/GuideMobileAppStore';
import { Router } from 'react-router-dom';
/** redux setup */
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { rootSaga } from './redux_modules';
import { composeWithDevTools } from 'redux-devtools-extension';
// import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
// import isMobile from './controllers/isMobile';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
const customHistory = createBrowserHistory();
// const logger = createLogger();
const reduxStore = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware, ReduxThunk.withExtraArgument({ history: customHistory }))),
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Router history={customHistory}>
        <Provider store={reduxStore}>
            {/* {isMobile && !navigator.userAgent.toLowerCase().includes('isnativeapp') ? <GuideMobileAppStore /> : <App />} */}
            <App />
        </Provider>
    </Router>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
