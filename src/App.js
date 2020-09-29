import React from 'react';
import './styles/common.scss';
import ScrollTop from './components/essentials/ScrollTop';
import { Route } from 'react-router-dom';
import ClassManagePage from './pages/ClassManagePage';

function App() {
    return (
        <>
            <ScrollTop>
                <Route path="/" component={ClassManagePage} />
            </ScrollTop>
        </>
    );
}

export default App;
