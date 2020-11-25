import React, { useState, useEffect } from 'react';
import '../../styles/nav_left.scss';
import { NavLink, withRouter } from 'react-router-dom';
import LogoWhite from '../../images/logos/nav_logo_white.png';
import People from '../../images/people.png';
import Avatar from '../../images/avatar.png';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { useSelector, useDispatch } from 'react-redux';
import { getDrafts } from '../../redux_modules/assignmentDraft';
import { Tooltip } from '@material-ui/core';

const LeftNavItem = React.memo(function LeftNavItem({ linkTo, children }) {
    return (
        <NavLink to={linkTo} activeClassName="left-a-active">
            <div className="left-nav-item">{children}</div>
        </NavLink>
    );
});

function LeftNav({ match }) {
    const { num } = match.params;
    const { data } = useSelector((state) => state.assignmentDraft.draftDatas);
    const sessions = useSelector((state) => state.RdxSessions);
    const dispatch = useDispatch();

    const [studentData, setStudentData] = useState([]);
    const [teacherData, setTeacherData] = useState([]);

    useEffect(() => {
        if (!sessions.userType) return;
        if (sessions.userType === 'teachers') dispatch(getDrafts());
        if (sessions.userType === 'teachers')
            Axios.get(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
                .then((res) => {
                    setStudentData(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
            .then((res) => {
                setTeacherData(res.data[0]);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, sessions]);

    return (
        <div className="left-nav-root">
            <Tooltip title="클래스 나가기">
                <div className="left-nav-box">
                    <LeftNavItem linkTo={`/`}>
                        <img src={LogoWhite} alt="logo_white"></img>
                    </LeftNavItem>
                </div>
            </Tooltip>

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
                                <b>총 {data ? data.length : 0}개</b> 입니다.
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
                    <h5>{teacherData['class_name']} 반</h5>
                    {sessions.userType === 'students' ? null : (
                        <>
                            <p>{teacherData['description']}</p>
                            <div className="info-num">
                                <img alt="student_num" src={People} />
                                <p>학생 수 {studentData.length}명</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="left-nav-box">
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
            </div>
        </div>
    );
}

export default React.memo(withRouter(LeftNav));
