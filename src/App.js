import React from 'react';
import './styles/common.scss';
import { Element } from 'react-scroll';
import Class from './pages/Class';
import Main from './pages/Main';
import { Route } from 'react-router-dom';

function App() {
    return (
        <>
            <Element name="main_top_start" />

            <main>
                <Route path="/" component={Main} exact />
                <Route path="/class/:id" component={Class} />
            </main>
        </>
    );
}

export default App;
