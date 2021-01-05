import React, { useState, useEffect } from 'react';
import '../../styles/nav_left.scss';
import { NavLink, withRouter } from 'react-router-dom';
import LogoWhite from '../../images/logos/nav_logo_white.png';
import People from '../../images/people.png';
import Avatar from '../../images/avatar.png';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { useSelector } from 'react-redux';
import TooltipCard from './TooltipCard';
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
    const { data } = useSelector((state) => state.assignmentDraft.draftDatas);
    const sessions = useSelector((state) => state.RdxSessions);

    const [studentData, setStudentData] = useState([]);
    const [teacherData, setTeacherData] = useState({});

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;

        if (sessions.userType === 'teachers') {
            Axios.get(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
                .then((res) => {
                    setStudentData(res.data);
                    window.studentsInCurrentClass = res.data.length || 0;
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
    }, [sessions.authId, sessions.academyName]);

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

                    {sessions.userType === 'students' ? null : (
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13.11" viewBox="0 0 12 13.11">
                                <path
                                    id="mdi_file_copy"
                                    d="M10.342.75H2.763A1.233,1.233,0,0,0,1.5,1.942v8.343H2.763V1.942h7.579ZM9.711,3.134,13.5,6.709v5.959a1.233,1.233,0,0,1-1.263,1.192H5.283a1.227,1.227,0,0,1-1.257-1.192l.006-8.343A1.227,1.227,0,0,1,5.289,3.134ZM9.079,7.305h3.474L9.079,4.028Z"
                                    transform="translate(-1.5 -0.75)"
                                    fill="#fff"
                                />
                            </svg>
                            <p>과제 게시판</p>
                        </LeftNavItem>
                    </div>
                    {sessions.userType === 'students' ? null : (
                        <>
                            <div className="a-wrapper">
                                <LeftNavItem linkTo={`/class/${num}/student-manage`}>
                                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.5455 0V10.1818H16V0H14.5455ZM11.6364 10.1818H13.0909V0H11.6364V10.1818ZM9.45455 0H0.727273C0.327273 0 0 0.327273 0 0.727273V9.45454C0 9.85454 0.327273 10.1818 0.727273 10.1818H9.45455C9.85455 10.1818 10.1818 9.85454 10.1818 9.45454V0.727273C10.1818 0.327273 9.85455 0 9.45455 0ZM5.09091 2C5.99273 2 6.72727 2.73455 6.72727 3.63636C6.72727 4.53818 5.99273 5.27273 5.09091 5.27273C4.18909 5.27273 3.45455 4.53818 3.45455 3.63636C3.45455 2.73455 4.18909 2 5.09091 2ZM8.36364 8.72727H1.81818V8.18182C1.81818 7.09091 4 6.54545 5.09091 6.54545C6.18182 6.54545 8.36364 7.09091 8.36364 8.18182V8.72727Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <p>수강생 관리</p>
                                </LeftNavItem>
                            </div>
                            <div className="a-wrapper">
                                <LeftNavItem linkTo={`/class/${num}/manage`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13">
                                        <g id="Settings" transform="translate(0.414)">
                                            <rect
                                                id="사각형_193"
                                                dataname="사각형 193"
                                                width="13"
                                                height="13"
                                                transform="translate(-0.414)"
                                                fill="none"
                                            />
                                            <path
                                                id="패스_104"
                                                dataname="패스 104"
                                                d="M265.8,7.866a1.573,1.573,0,1,0-1.546-1.573A1.564,1.564,0,0,0,265.8,7.866Zm-3.169-5.034a4.336,4.336,0,0,1,1.855-1.023L265.1,0h1.546l.618,1.809a5.368,5.368,0,0,1,1.855,1.023l1.855-.393.773,1.416L270.51,5.27a4.562,4.562,0,0,1,.077,1.023c0,.315-.077.708-.077,1.023l1.237,1.416-.773,1.416-1.855-.393a4.336,4.336,0,0,1-1.855,1.023l-.618,1.809H265.1l-.618-1.809a5.368,5.368,0,0,1-1.855-1.023l-1.855.393L260,8.731l1.237-1.416a4.562,4.562,0,0,1-.077-1.023c0-.315.077-.708.077-1.023L260,3.854l.773-1.416Z"
                                                transform="translate(-260)"
                                                fill="#fff"
                                                fillRule="evenodd"
                                            />
                                        </g>
                                    </svg>

                                    <p>클래스 초대/관리</p>
                                </LeftNavItem>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default React.memo(withRouter(LeftNav));
