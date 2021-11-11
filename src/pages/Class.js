import React, { useEffect } from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';
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
import TopNav from '../components/essentials/TopNav';
import * as $ from 'jquery';
import Calendar from './Calendar';

import VocaLearningMain from '../components/LearningVocas/VocaLearningMain';
import RestrictRoute from '../components/essentials/RestrictRoute';
import LearningVocas from '../components/LearningVocas/LearningVocas';
import CamStudyMainLists from '../components/Camstudy/CamStudyMainLists';
import Dashboard_1 from '../components/essentials/Dashboard_1';
import DashboardDDay from '../controllers/DashboardDDay.js';

const SlideWrapper = styled.div`
    transition: all 0.4s;

    @media (min-width: 903px) {
        padding: ${(props) => (props.leftNavState ? '95px 0 0 392px' : '95px 0 0 0')};
    }

    @media (min-width: 0) and (max-width: 902px) {
        padding: 95px 0 0 0;
    }
`;

const ClassPageSwitcher = (match, sessions) => {
    if (!match.id || !match.path) return <></>;
    const { id, path } = match;
    switch (id) {
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

        case 'calendar':
            if (sessions.userType === 'teachers') return <ErrorRestricted />;
            return <Calendar />;
        case 'dashboard':
            if (sessions.userType === 'teachers') return <ErrorRestricted />;
            return <Route path={`${path}`} component={Dashboard_1} />;

        case 'learning-vocas':
            return (
                <>
                    <Route path={path} exact component={VocaLearningMain} />
                    <Route path={`${path}/learning`} component={LearningVocas} />
                </>
            );
        case 'cam-study':
            return (
                <>
                    <Route path={path} exact component={CamStudyMainLists} />
                </>
            );
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
    const optimerModule = useSelector((state) => state.RdxOpTimerHelper.optimer);
    const sessions = useSelector((state) => state.RdxSessions);
    const [stMatch, setStMatch] = useState({ id: null, path: null });
    const [RenderSubPage, setRenderSubPage] = useState(null);
    const [leftNavState, setLeftNavState] = useState(window.innerWidth > 902);

    const handleLeftNav = () => {
        setLeftNavState(!leftNavState);
    };

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;
        setStMatch({ ...stMatch, id: match.params.id, path: match.path });
        if (sessions.userType === 'teachers') dispatch(getDrafts());
    }, [sessions.authId, sessions.academyName]);

    useEffect(() => {
        if (!stMatch.id || !stMatch.path) return;
        setRenderSubPage(ClassPageSwitcher(stMatch, sessions));
    }, [stMatch]);

    useEffect(() => {
        if (match.params.num === null || match.params.num === undefined || !sessions.authId || !optimerModule) return;
        // if (!window.optimerModule) {
        //     window.optimerModule = new OpTimer(match.params.num, sessions.authId);
        // }
        if (optimerModule.classNum === parseInt(match.params.num)) return;
        optimerModule.updateClassNumber(parseInt(match.params.num));
        window.DDayClass = new DashboardDDay(match.params.num, (msg, res) => {
            console.log(msg, res);
            //...setState(res);
        });
    }, [match, sessions, optimerModule]);

    return (
        <>
            <LeftNav leftNavState={leftNavState} handleLeftNav={handleLeftNav} setLeftNavState={setLeftNavState} />
            <SlideWrapper leftNavState={leftNavState} className="class-page-root">
                <TopNav leftNavState={leftNavState} handleLeftNav={handleLeftNav} />
                <BackdropComponent open={loading && !data && !error} />
                {error ? <Error /> : !data && sessions.userType === 'teachers' ? null : RenderSubPage}
            </SlideWrapper>
        </>
    );
}

export default Class;
