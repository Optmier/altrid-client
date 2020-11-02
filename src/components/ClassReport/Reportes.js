import React from 'react';
import { Route } from 'react-router-dom';
import ReportClass from './ReportClass';
import ReportStudent from './ReportStudent';

function Reportes({ match }) {
    return (
        <>
            <Route path={`${match.path}`} exact component={ReportClass} />
            <Route path={`${match.path}/:studentNum`} component={ReportStudent} />
        </>
    );
}

export default Reportes;
