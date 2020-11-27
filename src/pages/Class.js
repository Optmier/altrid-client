import React, { useEffect } from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';
import Draft from '../components/ClassDraft/Draft';
import Manage from '../components/ClassManage/Manage';
import Share from '../components/ClassShare/Share';
import { Route } from 'react-router-dom';
import Reportes from '../components/ClassReport/Reportes';
import Error from './Error';
import { useSelector, useDispatch } from 'react-redux';
import BackdropComponent from '../components/essentials/BackdropComponent';
import { getDrafts } from '../redux_modules/assignmentDraft';

const ClassPageSwitcher = ({ match }) => {
    let { id } = match.params;

    switch (id) {
        case `draft`:
            return <Draft />;
        case 'manage':
            return <Manage />;
        case 'share':
            return (
                <>
                    <Route path={`${match.path}`} exact component={Share} />
                    <Route path={`${match.path}/:activedNum`} component={Reportes} />
                </>
            );

        default:
            return (
                <>
                    <Error></Error>
                </>
            );
    }
};

function Class({ match }) {
    const dispatch = useDispatch();

    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas) || {
        loading: false,
        data: null,
        error: null,
    };
    const sessions = useSelector((state) => state.RdxSessions);

    useEffect(() => {
        if (sessions.userType === 'teachers') dispatch(getDrafts());
    }, [sessions]);

    return (
        <>
            <LeftNav />

            <div className="class-page-root">
                {loading && !data ? (
                    <BackdropComponent open={true} />
                ) : error ? (
                    <Error />
                ) : !data ? null : (
                    <ClassPageSwitcher match={match} />
                )}
            </div>
        </>
    );
}

export default Class;
