import React from 'react';
import './styles/common.scss';
import Class from './pages/Class';
import Main from './pages/Main';
import { Route } from 'react-router-dom';
import ScrollTop from './components/essentials/ScrollTop';
import Footer from './components/essentials/Footer';

function App() {
    return (
        <>
            <ScrollTop>
                <Route path="/" component={Main} exact />
                <Route path="/class" component={Class} />
            </ScrollTop>
            <Footer />
        </>
    );
}

export default App;
