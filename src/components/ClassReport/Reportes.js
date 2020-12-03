import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RestrictRoute from '../essentials/RestrictRoute';
import ReportClass from './ReportClass';
import ReportStudent from './ReportStudent';

function Reportes({ match }) {
    const sessions = useSelector((state) => state.RdxSessions);

    useEffect(() => {
        // console.log('reports?');
    }, []);

    return (
        <>
            <RestrictRoute
                path={`${match.path}`}
                exact
                component={ReportClass}
                role={sessions.userType}
                allowedTypes={['admins', 'teachers']}
            />
            <RestrictRoute
                path={`${match.path}/:studentNum`}
                component={ReportStudent}
                role={sessions.userType}
                allowedTypes={['admins', 'teachers', 'students']}
            />
        </>
    );
}

export default Reportes;
