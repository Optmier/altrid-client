import React from 'react';
import './styles/common.scss';
import { Element } from 'react-scroll';
import Class from './pages/Class';
import Main from './pages/Main';
import { Route } from 'react-router-dom';
import ScrollTop from './components/essentials/ScrollTop';
import Footer from './components/essentials/Footer';
import TofelEditorTemp from './pages/TofelEditorTemp';
import UserExample from './components/TOFELRenderer/UserExample';
import EyetrackingPlayer from './components/TOFELRenderer/EyetrackingPlayer';
import PlayerExample from './components/TOFELRenderer/PlayerExample';

function App() {
    return (
        <>
            <Element name="main_top_start" />
            <ScrollTop>
                <main>
                    <Route path="/" component={Main} exact />
                    <Route path="/class/:id" component={Class} />
                    <Route path="/temp" component={TofelEditorTemp} />
                    <Route path="/user-example" component={UserExample} />
                    <Route path="/player-example" component={PlayerExample} />
                </main>
            </ScrollTop>
        </>
    );
}

export default App;
