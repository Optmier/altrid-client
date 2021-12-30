import React from 'react';
import { useSelector } from 'react-redux';
import RestrictRoute from '../essentials/RestrictRoute';
import ReportClass from './ReportClass';
import ReportStudent from './ReportStudent';
import HandsUpList from './QnA/HandsUpList';

function Reportes({ match }) {
    const sessions = useSelector((state) => state.RdxSessions);
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
                path={`${match.path}/hands-up`}
                exact
                component={HandsUpList}
                role={sessions.userType}
                allowedTypes={['admins', 'teachers']}
            />
            <RestrictRoute
                path={`${match.path}/details`}
                exact
                component={ReportStudent}
                role={sessions.userType}
                allowedTypes={['admins', 'teachers', 'students']}
            />
        </>
    );
}

export default Reportes;
