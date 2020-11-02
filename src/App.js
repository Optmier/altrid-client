import React from 'react';
import './styles/common.scss';
import { Element } from 'react-scroll';
import Class from './pages/Class';
import Main from './pages/Main';
import { Route, withRouter } from 'react-router-dom';
import ScrollTop from './components/essentials/ScrollTop';
import Footer from './components/essentials/Footer';
import TrashButton from './components/essentials/TrashButton';

function App({ history }) {
    return (
        <>
            <Element name="main_top_start" />
            <ScrollTop>
                <main>
                    <Route path="/" component={Main} exact />
                    <Route path="/class/:id" component={Class} />
                </main>
            </ScrollTop>
            {history.location.pathname === '/' ? (
                <Footer />
            ) : history.location.pathname === '/class/draft' || history.location.pathname === '/class/share' ? (
                <TrashButton />
            ) : (
                ''
            )}
        </>
    );
}

export default withRouter(App);
