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
import ErrorRestricted from './ErrorRestricted';
import { useState } from 'react';
import StudentManage from '../components/ClassStudentManage/StudentManage';
import VideoLecturesManage from '../components/VideoLectures/VideoLecturesManage';
import styled from 'styled-components';

const StyleWrapper = styled.div`
    padding: ${(props) => (props.id === 'draft' ? '0' : '30px 0 0 240px')};
`;

const ClassPageSwitcher = (match, sessions) => {
    if (!match.id || !match.path) return <></>;
    const { id, path } = match;
    switch (id) {
        case `draft`:
            if (sessions.userType === 'students') return <ErrorRestricted />;
            return <Draft />;
        case 'manage':
            if (sessions.userType === 'students') return <ErrorRestricted />;
            return <Manage />;
        case 'student-manage':
            if (sessions.userType === 'students') return <ErrorRestricted />;
            return <StudentManage />;
        case 'share':
            return (
                <>
                    <Route path={`${path}`} exact component={Share} />
                    <Route path={`${path}/:activedNum`} component={Reportes} />
                </>
            );
        case 'vid-lecture':
            return <VideoLecturesManage />;
        default:
            return <Error />;
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
    const [stMatch, setStMatch] = useState({ id: null, path: null });
    const [RenderSubPage, setRenderSubPage] = useState(null);

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;
        setStMatch({ ...stMatch, id: match.params.id, path: match.path });
        if (sessions.userType === 'teachers') dispatch(getDrafts());
    }, [sessions.authId, sessions.academyName]);

    useEffect(() => {
        if (!stMatch.id || !stMatch.path) return;
        setRenderSubPage(ClassPageSwitcher(stMatch, sessions));
    }, [stMatch]);

    return (
        <>
            {match.params.id === 'draft' ? null : <LeftNav />}
            <StyleWrapper id={match.params.id} className="class-page-root">
                <BackdropComponent open={loading && !data && !error} />
                {error ? (
                    <Error />
                ) : !data && sessions.userType === 'teachers' ? null : (
                    // <ClassPageSwitcher sessions={sessions} match={stMatch} />
                    RenderSubPage
                )}
            </StyleWrapper>
        </>
    );
}

export default Class;
