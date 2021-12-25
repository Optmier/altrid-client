import React, { useEffect } from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';
import Manage from '../components/ClassManage/Manage';
import Share from '../components/ClassShare/Share';
import { NavLink, Route } from 'react-router-dom';
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
import { setLeftNavStateGlobal, toggleLeftNavGlobal } from '../redux_modules/leftNavStateGlobal';
import BackgroundTheme from '../AltridUI/ThemeColors/BackgroundTheme';
import Typography from '../AltridUI/Typography/Typography';

const SlideWrapper = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 32px 32px 0 32px;
    position: relative;
    height: calc(100% - 32px);
    transition: all 0.4s;

    @media (min-width: 903px) {
        /* padding: ${(props) => (props.leftNavState ? '36px 0 0 0' : '36px 0 0 0')}; */
        margin-left: ${(props) => (props.leftNavState ? '393px' : 0)};
    }

    @media (min-width: 0) and (max-width: 902px) {
        /* padding: 20px 0 0 0; */
        margin-left: 0;
    }

    @media (max-width: 640px) {
        padding: 16px 16px 0 16px;
        height: calc(100% - 32px);
    }
`;

const BreadCrumbNav = styled.div`
    align-items: center;
    background-color: #f6f8f9;
    display: flex;
    position: fixed;
    z-index: 102;
    width: calc(100% - 64px ${({ leftNavState }) => (leftNavState ? '- 393px' : null)});
    max-width: 960px;
    padding: 32px 32px 0px 32px;
    margin-top: -32px;
    transition: width 0.4s;
    @media (min-width: 0) and (max-width: 902px) {
        /* padding: 20px 0 0 0; */
    }
    @media (max-width: 640px) {
        padding: 16px 16px 0px 16px;
        margin-top: -16px;
        width: calc(100% - 32px);
    }
`;
const BreadCrumbItemAdornment = styled.svg`
    margin-left: 12px;
    margin-right: 12px;
`;
const BreadCrumbItem = styled.div`
    color: #3b1689;
    color: ${({ lastIdx }) => (lastIdx ? '#9AA5AF' : null)};
    pointer-events: ${({ lastIdx }) => (lastIdx ? 'none' : null)};
`;
const BreadCrumbItemLink = styled.a`
    color: ${({ lastIdx }) => (lastIdx ? '#9AA5AF' : null)};
    pointer-events: ${({ lastIdx }) => (lastIdx ? 'none' : null)};
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
            return (
                <>
                    <Route path={path} exact component={Calendar} />
                </>
            );
        // case 'dashboard':
        //     if (sessions.userType === 'teachers') return <ErrorRestricted />;
        //     return <Route path={`${path}`} component={Dashboard_1} />;

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

const makeBreadCrumbData = (startLevel, history) => {
    const arr = history.location.pathname.split('/');
    const queries = new URLSearchParams(history.location.search);
    /** define menu names */
    const menuNames = {
        share: {
            name: '과제 게시판',
            sub: {
                '&numbers': {
                    name: '클래스 리포트',
                    sub: {
                        details: {
                            name: '학생 상세 리포트',
                        },
                        'hands-up': {
                            name: '손을 든 문제 목록',
                        },
                    },
                },
            },
        },
        'vid-lecture': {
            name: '화상 강의',
        },
        calendar: {
            name: '마이 캘린더',
        },
        manage: {
            name: '학생 및 클래스 관리',
        },
        'learning-vocas': {
            name: '단어 학습',
            sub: {
                learning: {
                    name: '학습 진행 중',
                },
            },
        },
        'cam-study': {
            name: '캠 스터디',
        },
    };
    const returnData = [];
    let steps = menuNames;
    for (let i = startLevel; i < arr.length; i++) {
        const obj = {
            name: '',
            path: '/',
        };
        const currentName = arr[i];
        let currentMenuName = '';
        // 항목이 문자열일때
        if (isNaN(parseInt(currentName))) {
            if (steps[currentName]) {
                currentMenuName = steps[currentName].name;
                obj.name = currentMenuName;
                obj.path = arr.slice(0, i).join('/') + '/' + currentName;
                steps = steps[currentName].sub;
            } else if (steps['&strings']) {
                currentMenuName = steps['&strings'].name;
                obj.name = currentMenuName;
                obj.path = arr.slice(0, i).join('/') + '/' + currentName;
                steps = steps['&strings'].sub;
            } else {
                break;
            }
        }
        // 항목이 숫자일때
        else {
            if (steps[parseInt(currentName)]) {
                currentMenuName = steps[parseInt(currentName)].name;
                obj.name = currentMenuName;
                obj.path = arr.slice(0, i).join('/') + '/' + currentName;
                steps = steps[parseInt(currentName)].sub;
            } else if (steps['&numbers']) {
                currentMenuName = steps['&numbers'].name;
                obj.name = currentMenuName;
                obj.path = arr.slice(0, i).join('/') + '/' + currentName;
                steps = steps['&numbers'].sub;
            } else {
                break;
            }
        }
        if (history.location.search && i === arr.length - 1) {
            obj.path += history.location.search;
        }
        returnData.push(obj);
    }
    return returnData;
};

function Class({ match, history }) {
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
    const [breadCrumbMenus, setBreadCrumbMenus] = useState([]);
    const { leftNavGlobal } = useSelector((state) => state.RdxGlobalLeftNavState);

    const handleLeftNav = () => {
        dispatch(toggleLeftNavGlobal());
    };

    const setLeftNavState = (state) => {
        dispatch(setLeftNavStateGlobal(state));
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
        setBreadCrumbMenus(makeBreadCrumbData(3, history));
    }, [history.location]);

    useEffect(() => {
        if (match.params.num === null || match.params.num === undefined || !sessions.authId || !optimerModule) return;
        // if (!window.optimerModule) {
        //     window.optimerModule = new OpTimer(match.params.num, sessions.authId);
        // }
        if (optimerModule.classNum === parseInt(match.params.num)) return;
        optimerModule.updateClassNumber(parseInt(match.params.num));
        window.DDayClass = new DashboardDDay(match.params.num, (msg, res) => {
            // console.log(msg, res);
            //...setState(res);
        });
    }, [match, sessions, optimerModule]);

    return (
        <>
            <BackgroundTheme colors="#f6f8f9" />
            <LeftNav leftNavState={leftNavGlobal} handleLeftNav={handleLeftNav} setLeftNavState={setLeftNavState} />
            <SlideWrapper leftNavState={leftNavGlobal}>
                {/* <TopNav leftNavState={leftNavGlobal} handleLeftNav={handleLeftNav} /> */}
                {history.location.pathname.includes('/learning-vocas/learning') ? null : (
                    <BreadCrumbNav leftNavState={leftNavGlobal}>
                        {breadCrumbMenus.map((data, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 ? (
                                    <BreadCrumbItemAdornment width="6" height="2" viewBox="0 0 6 2" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1Z"
                                            fill="#3B1689"
                                        />
                                        <path
                                            d="M6 1C6 1.55228 5.55228 2 5 2C4.44772 2 4 1.55228 4 1C4 0.447715 4.44772 0 5 0C5.55228 0 6 0.447715 6 1Z"
                                            fill="#3B1689"
                                        />
                                    </BreadCrumbItemAdornment>
                                ) : null}
                                <BreadCrumbItem lastIdx={idx === breadCrumbMenus.length - 1}>
                                    <NavLink to={data.path}>
                                        <Typography type="label" size="m">
                                            {data.name}
                                        </Typography>
                                    </NavLink>
                                </BreadCrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadCrumbNav>
                )}

                <BackdropComponent open={loading && !data && !error} />
                {error ? <Error /> : !data && sessions.userType === 'teachers' ? null : RenderSubPage}
            </SlideWrapper>
        </>
    );
}

export default Class;
