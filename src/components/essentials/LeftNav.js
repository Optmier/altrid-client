import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/nav_left.scss';
import { NavLink, withRouter } from 'react-router-dom';
import LogoWhite from '../../images/logos/nav_logo_white.png';
import People from '../../images/people.png';
import Avatar from '../../images/avatar.png';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { useDispatch, useSelector } from 'react-redux';
import TooltipCard from './TooltipCard';
import { setCurrentVideoLecture, setStudentsNum, updateLiveCounts } from '../../redux_modules/currentClass';
import Error from '../../pages/Error';

const LeftNavItem = React.memo(function LeftNavItem({ linkTo, children }) {
    return (
        <NavLink to={linkTo} activeClassName="left-a-active">
            <div className="left-nav-item">{children}</div>
        </NavLink>
    );
});

function LeftNav({ match, history }) {
    const { num } = match.params;

    /** redux-module 불러내기 */
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.assignmentDraft.draftDatas);
    const sessions = useSelector((state) => state.RdxSessions);
    const serverdate = useSelector((state) => state.RdxServerDate);
    const setStudentsNumber = useCallback((studentsNumber) => dispatch(setStudentsNum(studentsNumber)));
    const setVideoLecture = useCallback((videoLecture) => dispatch(setCurrentVideoLecture(videoLecture)));
    const updateVideoLiveCounts = useCallback((liveCounts) => dispatch(updateLiveCounts(liveCounts)));

    const [studentData, setStudentData] = useState([]);
    const [teacherData, setTeacherData] = useState({});

    const [hasVideoLecture, setHasVideoLecture] = useState(false);

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;

        if (sessions.userType === 'teachers') {
            Axios.get(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
                .then((res) => {
                    setStudentData(res.data);
                    setStudentsNumber(res.data.length || 0);
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
            .then((res) => {
                setTeacherData(res.data[0]);
            })
            .catch((err) => {
                console.error(err);
            });

        Axios.get(`${apiUrl}/meeting-room/last`, {
            params: {
                creatorId: sessions.userType === 'students' ? null : sessions.authId,
                classNumber: num,
                academyCode: sessions.academyCode,
            },
            withCredentials: true,
        })
            .then((res) => {
                if (window.intervalLiveCounts) {
                    clearInterval(window.intervalLiveCounts);
                    delete window.intervalLiveCounts;
                }
                if (!res.data || new Date(res.data.end_at).getTime() < new Date().getTime()) {
                    setVideoLecture(null);
                    return;
                }
                setVideoLecture({ ...res.data, liveCounts: 0 });
                setHasVideoLecture(true);
                Axios.get(`${apiUrl}/meeting-room/live-counts/${res.data.room_id}`, { withCredentials: true })
                    .then((res) => {
                        if (res.data !== null || res.data !== undefined) {
                            updateVideoLiveCounts(res.data);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                if (!window.intervalLiveCounts) {
                    window.intervalLiveCounts = setInterval(() => {
                        Axios.get(`${apiUrl}/meeting-room/live-counts/${res.data.room_id}`, { withCredentials: true })
                            .then((res) => {
                                if (res.data !== null || res.data !== undefined) {
                                    updateVideoLiveCounts(res.data);
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }, 15000);
                }
            })
            .catch((err) => {
                console.error(err);
            });
        return () => {};
    }, [sessions.authId, sessions.academyName]);

    useEffect(() => {
        return () => {
            if (window.intervalLiveCounts) {
                clearInterval(window.intervalLiveCounts);
                delete window.intervalLiveCounts;
            }
        };
    }, []);

    // error check 1. 아예 없는반에 접근시
    if (!teacherData) history.replace('/error');
    // error check 2. 선생님, 우리반이 아닌 다른 반 접근 시
    else if (sessions.userType === 'teachers') {
        if (teacherData.teacher_id && sessions.authId !== teacherData.teacher_id) {
            history.replace('/error');
        }
    }

    return (
        <div className="left-nav-root">
            <div className="left-nav">
                <TooltipCard title="클래스 나가기">
                    <div className="left-nav-box">
                        <LeftNavItem linkTo={`/`}>
                            <img src={LogoWhite} alt="logo_white"></img>
                        </LeftNavItem>
                    </div>
                </TooltipCard>

                <div className="left-nav-box">
                    <div className="box-wrapper" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <img alt="avatar" src={Avatar} />
                        <h4>
                            {sessions.userName} {sessions.userType === 'teachers' ? '선생님' : '님'}
                        </h4>
                    </div>

                    {sessions.userType === 'students' ? (
                        hasVideoLecture ? (
                            <div className="a-wrapper">
                                <LeftNavItem linkTo={`/class/${num}/vid-lecture`}>
                                    <div className="draft-ment">화상 강의 진행중</div>
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path
                                            fill="white"
                                            d="M15,12V20H5V12H15M16,10H4A1,1 0 0,0 3,11V21A1,1 0 0,0 4,22H16A1,1 0 0,0 17,21V17.5L21,21.5V10.5L17,14.5V11A1,1 0 0,0 16,10M3,3.86L4.4,5.24C7.5,2.19 12.5,2.19 15.6,5.24L17,3.86C13.14,0.05 6.87,0.05 3,3.86M5.8,6.63L7.2,8C8.75,6.5 11.25,6.5 12.8,8L14.2,6.63C11.88,4.34 8.12,4.34 5.8,6.63Z"
                                        />
                                    </svg>
                                </LeftNavItem>
                            </div>
                        ) : null
                    ) : (
                        <div className="a-wrapper">
                            <LeftNavItem linkTo={`/class/${num}/draft`}>
                                <div className="draft-ment">
                                    현재 생성된 과제는
                                    <br />
                                    <b>총 {data ? data.length : '-'}개</b> 입니다.
                                </div>

                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M15 0H3C2.20435 0 1.44129 0.270918 0.87868 0.753154C0.31607 1.23539 0 1.88944 0 2.57143V15.4286C0 16.1106 0.31607 16.7646 0.87868 17.2468C1.44129 17.7291 2.20435 18 3 18H15C15.7956 18 16.5587 17.7291 17.1213 17.2468C17.6839 16.7646 18 16.1106 18 15.4286V2.57143C18 1.88944 17.6839 1.23539 17.1213 0.753154C16.5587 0.270918 15.7956 0 15 0ZM9.75 6.42857C9.75 6.25808 9.67098 6.09456 9.53033 5.974C9.38968 5.85344 9.19891 5.78571 9 5.78571C8.80109 5.78571 8.61032 5.85344 8.46967 5.974C8.32902 6.09456 8.25 6.25808 8.25 6.42857V8.35714H6C5.80109 8.35714 5.61032 8.42487 5.46967 8.54543C5.32902 8.66599 5.25 8.8295 5.25 9C5.25 9.1705 5.32902 9.33401 5.46967 9.45457C5.61032 9.57513 5.80109 9.64286 6 9.64286H8.25V11.5714C8.25 11.7419 8.32902 11.9054 8.46967 12.026C8.61032 12.1466 8.80109 12.2143 9 12.2143C9.19891 12.2143 9.38968 12.1466 9.53033 12.026C9.67098 11.9054 9.75 11.7419 9.75 11.5714V9.64286H12C12.1989 9.64286 12.3897 9.57513 12.5303 9.45457C12.671 9.33401 12.75 9.1705 12.75 9C12.75 8.8295 12.671 8.66599 12.5303 8.54543C12.3897 8.42487 12.1989 8.35714 12 8.35714H9.75V6.42857Z"
                                        fill="white"
                                    />
                                </svg>
                            </LeftNavItem>
                        </div>
                    )}
                </div>

                <div className="left-nav-box">
                    <div className="box-wrapper">
                        <h5>{teacherData ? teacherData['class_name'] : ''}</h5>
                        <>
                            <p>{teacherData ? teacherData['description'] : ''}</p>
                            {sessions.userType === 'students' ? null : (
                                <div className="info-num">
                                    <img alt="student_num" src={People} />
                                    <p>학생 수 {studentData.length}명</p>
                                </div>
                            )}
                        </>
                    </div>
                </div>

                <div className="left-nav-box">
                    <div className="a-wrapper">
                        <LeftNavItem linkTo={`/class/${num}/share`}>
                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.25 10.56C10.68 10.56 10.17 10.785 9.78 11.1375L4.4325 8.025C4.47 7.8525 4.5 7.68 4.5 7.5C4.5 7.32 4.47 7.1475 4.4325 6.975L9.72 3.8925C10.125 4.2675 10.6575 4.5 11.25 4.5C12.495 4.5 13.5 3.495 13.5 2.25C13.5 1.005 12.495 0 11.25 0C10.005 0 9 1.005 9 2.25C9 2.43 9.03 2.6025 9.0675 2.775L3.78 5.8575C3.375 5.4825 2.8425 5.25 2.25 5.25C1.005 5.25 0 6.255 0 7.5C0 8.745 1.005 9.75 2.25 9.75C2.8425 9.75 3.375 9.5175 3.78 9.1425L9.12 12.2625C9.0825 12.42 9.06 12.585 9.06 12.75C9.06 13.9575 10.0425 14.94 11.25 14.94C12.4575 14.94 13.44 13.9575 13.44 12.75C13.44 11.5425 12.4575 10.56 11.25 10.56Z"
                                    fill="white"
                                />
                            </svg>
                            <p>과제 게시판</p>
                        </LeftNavItem>
                    </div>
                    {sessions.userType === 'students' ? null : (
                        <div className="a-wrapper">
                            <LeftNavItem linkTo={`/class/${num}/vid-lecture`}>
                                <svg width="15" height="17" viewBox="0 0 22 24">
                                    <path
                                        fill="white"
                                        d="M15,12V20H5V12H15M16,10H4A1,1 0 0,0 3,11V21A1,1 0 0,0 4,22H16A1,1 0 0,0 17,21V17.5L21,21.5V10.5L17,14.5V11A1,1 0 0,0 16,10M3,3.86L4.4,5.24C7.5,2.19 12.5,2.19 15.6,5.24L17,3.86C13.14,0.05 6.87,0.05 3,3.86M5.8,6.63L7.2,8C8.75,6.5 11.25,6.5 12.8,8L14.2,6.63C11.88,4.34 8.12,4.34 5.8,6.63Z"
                                    />
                                </svg>
                                <p>실시간 화상 강의</p>
                            </LeftNavItem>
                        </div>
                    )}
                    {sessions.userType === 'students' ? null : (
                        <div className="a-wrapper">
                            <LeftNavItem linkTo={`/class/${num}/manage`}>
                                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.5455 0V10.1818H16V0H14.5455ZM11.6364 10.1818H13.0909V0H11.6364V10.1818ZM9.45455 0H0.727273C0.327273 0 0 0.327273 0 0.727273V9.45454C0 9.85454 0.327273 10.1818 0.727273 10.1818H9.45455C9.85455 10.1818 10.1818 9.85454 10.1818 9.45454V0.727273C10.1818 0.327273 9.85455 0 9.45455 0ZM5.09091 2C5.99273 2 6.72727 2.73455 6.72727 3.63636C6.72727 4.53818 5.99273 5.27273 5.09091 5.27273C4.18909 5.27273 3.45455 4.53818 3.45455 3.63636C3.45455 2.73455 4.18909 2 5.09091 2ZM8.36364 8.72727H1.81818V8.18182C1.81818 7.09091 4 6.54545 5.09091 6.54545C6.18182 6.54545 8.36364 7.09091 8.36364 8.18182V8.72727Z"
                                        fill="white"
                                    />
                                </svg>
                                <p>클래스 관리</p>
                            </LeftNavItem>
                        </div>
                    )}
                </div>
            </div>
            <div className="left-nav-exit">
                <LeftNavItem linkTo={`/`}>
                    <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.5467 19.1014L16.6667 20.8289L10 14.7028L16.6667 8.57668L18.5467 10.3042L15.1067 13.4776H28V15.928H15.1067L18.5467 19.1014ZM6.66667 3.67578H25.3333C26.8133 3.67578 28 4.77848 28 6.12623V11.0271H25.3333V6.12623H6.66667V23.2794H25.3333V18.3785H28V23.2794C28 24.6271 26.8133 25.7298 25.3333 25.7298H6.66667C5.2 25.7298 4 24.6271 4 23.2794V6.12623C4 4.77848 5.2 3.67578 6.66667 3.67578Z"
                            fill="#daebf7"
                        />
                    </svg>
                </LeftNavItem>
            </div>
        </div>
    );
}

export default React.memo(withRouter(LeftNav));
