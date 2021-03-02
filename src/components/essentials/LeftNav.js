import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/nav_left.scss';
import { NavLink, withRouter } from 'react-router-dom';
import People from '../../images/people.png';
import Avatar from '../../images/avatar.png';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { useDispatch, useSelector } from 'react-redux';
import TooltipCard from './TooltipCard';
import { setCurrentVideoLectures, setStudentsNum, updateLiveCounts } from '../../redux_modules/currentClass';
import Error from '../../pages/Error';
import styled from 'styled-components';
import VideocamIcon from '@material-ui/icons/Videocam';
import Popover from '@material-ui/core/Popover';
import { LeftPopOverNavigator, LeftPopOverCheck } from './LeftNavLogo';

window.liveCountsInterval = {};
const StylePopOver = styled.div`
    display: flex;
    flex-direction: column;
    & .header {
        font-size: 0.76rem;
        font-weight: 600;
        color: #8b8989;
        border-bottom: 1px solid #e0e0e0;
        padding: 0.6rem 2rem;
    }

    & .left-a-active {
        & .row {
            & .check {
                display: block;
                margin-left: 1.3rem;
            }
        }
    }
    & .row {
        padding: 0.7rem 1.6rem;
        display: flex;
        align-items: center;

        & .check {
            display: none;
        }
        & > svg {
            margin-right: 28px;
        }

        & .contents {
            display: flex;
            flex-direction: column;

            & .name {
                font-size: 1rem;
                font-weight: 600;
                color: black;
            }
            & .desc {
                font-size: 0.85rem;
                font-weight: 400;
                color: #8b8989;

                max-width: 150px;
                min-width: 100px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
    & .row:hover {
        background-color: #80808054;
    }
`;

const StyleLeftNav = styled.div`
    transition: all 0.4s;

    @media (min-width: 903px) {
        width: 240px;
        left: ${(props) => (props.leftNavState ? '0' : '-240px')};
    }

    @media (min-width: 0) and (max-width: 902px) {
        width: 100%;
        left: ${(props) => (props.leftNavState ? '0' : '-100%')};
    }
`;

const LeftNavItem = React.memo(function LeftNavItem({ linkTo, children }) {
    return (
        <NavLink to={linkTo} activeClassName="left-a-active">
            <div className="left-nav-item">{children}</div>
        </NavLink>
    );
});

function LeftNav({ match, history, leftNavState, handleLeftNav, setLeftNavState }) {
    const { num, id } = match.params;
    /** redux-module 불러내기 */
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.assignmentDraft.draftDatas);
    const sessions = useSelector((state) => state.RdxSessions);
    const serverdate = useSelector((state) => state.RdxServerDate);
    const classLists = useSelector((state) => state.classLists);
    window.classLists = classLists;

    const setStudentsNumber = useCallback((studentsNumber) => dispatch(setStudentsNum(studentsNumber)));
    const setVideoLectures = useCallback((videoLecture) => dispatch(setCurrentVideoLectures(videoLecture)));
    const updateVideoLiveCounts = useCallback((roomId, liveCounts) => dispatch(updateLiveCounts(roomId, liveCounts)));

    const [studentData, setStudentData] = useState([]);
    const [teacherData, setTeacherData] = useState({});
    const [hasVideoLecture, setHasVideoLecture] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const popoverId = open ? 'simple-popover' : undefined;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName || !serverdate.datetime) return;

        // if (sessions.userType === 'teachers') {
        Axios.get(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
            .then((res) => {
                setStudentData(res.data);
                setStudentsNumber(res.data.length || 0);
            })
            .catch((err) => {
                console.error(err);
            });
        // }

        Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
            .then((res) => {
                setTeacherData(res.data[0]);
            })
            .catch((err) => {
                console.error(err);
            });

        if (id === 'vid-lecture') {
            Axios.get(`${apiUrl}/meeting-room`, {
                params: {
                    creatorId: sessions.userType === 'students' ? null : sessions.authId,
                    classNumber: num,
                    academyCode: sessions.academyCode,
                },
                withCredentials: true,
            })
                .then((res) => {
                    const listLength = res.data.length;
                    const filteredList = {
                        current: [],
                        scheduled: [],
                        done: [],
                    };

                    for (let i = 0; i < listLength; i++) {
                        const lectureStartDate = new Date(res.data[i].start_at).getTime();
                        const lectureEndDate = new Date(res.data[i].end_at).getTime();
                        const forceClosed = res.data[i].force_closed;
                        // 진행 예정 강의
                        if (lectureStartDate > serverdate.datetime && !forceClosed) {
                            filteredList.scheduled.push(res.data[i]);
                        }
                        // 완료된 강의
                        else if (lectureEndDate < serverdate.datetime || forceClosed) {
                            filteredList.done.push(res.data[i]);
                        }
                        // 진행 중인 강의
                        else {
                            if (!hasVideoLecture) setHasVideoLecture(true);
                            filteredList.current.push({ ...res.data[i], liveCounts: 0 });
                            Axios.get(`${apiUrl}/meeting-room/live-counts/${res.data[i].room_id}`, { withCredentials: true })
                                .then((counts) => {
                                    if (counts.data !== null || counts.data !== undefined) {
                                        updateVideoLiveCounts(res.data[i].room_id, counts.data);
                                    }
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                            // 라이브 카운터 등록
                            if (!window.liveCountsInterval[res.data[i].room_id]) {
                                window.liveCountsInterval[res.data[i].room_id] = setInterval(() => {
                                    Axios.get(`${apiUrl}/meeting-room/live-counts/${res.data[i].room_id}`, { withCredentials: true })
                                        .then((counts) => {
                                            if (counts.data !== null || counts.data !== undefined) {
                                                updateVideoLiveCounts(res.data[i].room_id, counts.data);
                                            }
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                        });
                                }, 15000);
                            }
                        }
                    }

                    // 정렬
                    filteredList.done.sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime());
                    filteredList.scheduled.sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
                    filteredList.current.sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());

                    setVideoLectures(filteredList);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        return () => {};
    }, [sessions.authId, sessions.academyName, serverdate.datetime]);

    useEffect(() => {
        if (window.innerWidth <= 902) {
            setLeftNavState(false);
        }
    }, [history.location.pathname]);

    // error check 1. 아예 없는반에 접근시
    if (!teacherData) history.replace('/error');
    // error check 2. 선생님, 우리반이 아닌 다른 반 접근 시
    else if (sessions.userType === 'teachers') {
        if (teacherData.teacher_id && sessions.authId !== teacherData.teacher_id) {
            history.replace('/error');
        }
    }

    return (
        <>
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <StylePopOver>
                    <div className="header">클래스 바로가기</div>
                    {classLists.map((i) => (
                        <LeftNavItem key={i.idx} linkTo={`/class/${i.idx}/share`}>
                            <div className="row">
                                <LeftPopOverNavigator />
                                <div className="contents">
                                    <div className="name"> {i.name}</div>
                                    <div className="desc"> {i.description}</div>
                                </div>
                                <div className="check">
                                    <LeftPopOverCheck />
                                </div>
                            </div>
                        </LeftNavItem>
                    ))}
                </StylePopOver>
            </Popover>

            <StyleLeftNav leftNavState={leftNavState} className="left-nav-root">
                <div className="left-nav">
                    <div className="left-nav-box">
                        <div className="box-wrapper nav-hambuger">
                            <div className="left-nav-hambuger">
                                <TooltipCard title={teacherData['class_name'] ? teacherData['class_name'] : '-'}>
                                    <h5 onClick={handleClick}>{teacherData ? teacherData['class_name'] : ''}</h5>
                                </TooltipCard>
                                <div id="left-nav-drawer" onClick={handleLeftNav}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14.96" height="20.049" viewBox="0 0 14.96 20.049">
                                        <g id="그룹_523" data-name="그룹 523" transform="translate(-227.939 -26.244)" opacity="0.558">
                                            <path
                                                id="패스_550"
                                                data-name="패스 550"
                                                d="M-10394.5,18180.551l-7.92,10.176,7.92,9.24"
                                                transform="translate(10637 -18154)"
                                                fill="none"
                                                stroke="#fff"
                                                strokeWidth="1"
                                            />
                                            <path
                                                id="패스_551"
                                                data-name="패스 551"
                                                d="M-10394.5,18180.551l-7.92,10.176,7.92,9.24"
                                                transform="translate(10631 -18154)"
                                                fill="none"
                                                stroke="#fff"
                                                strokeWidth="1"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="box-wrapper">
                            <>
                                <TooltipCard title={teacherData['description'] ? teacherData['description'] : '-'}>
                                    <p className="p-desc">{teacherData ? teacherData['description'] : ''}</p>
                                </TooltipCard>
                                {sessions.userType === 'students' ? null : (
                                    <div className="info-num">
                                        <img alt="student_num" src={People} />
                                        <p>학생 수 {studentData.length}명</p>
                                    </div>
                                )}
                            </>
                        </div>

                        {sessions.userType === 'students' ? null : (
                            <div className="a-wrapper">
                                <LeftNavItem linkTo={`/main-draft`}>
                                    <div className="draft-button">
                                        <svg id="Folder" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path
                                                id="패스_178"
                                                data-name="패스 178"
                                                d="M0,10.926V.984A1.022,1.022,0,0,1,.311.259.984.984,0,0,1,.984,0H6.731a.588.588,0,0,1,.414.155.7.7,0,0,1,.311.362l.518,1.45h6.99a1.022,1.022,0,0,1,.725.311A.94.94,0,0,1,16,3v7.974a1.022,1.022,0,0,1-.311.725.94.94,0,0,1-.725.311H.984A1.022,1.022,0,0,1,.259,11.7,1.4,1.4,0,0,1,0,10.926Z"
                                                transform="translate(0 2)"
                                                fill="#fff"
                                            />
                                            <rect id="사각형_1447" data-name="사각형 1447" width="16" height="16" fill="none" />
                                        </svg>
                                        과제 생성 및 게시
                                    </div>
                                </LeftNavItem>
                            </div>
                        )}
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
                        <div className="a-wrapper">
                            <LeftNavItem linkTo={`/class/${num}/vid-lecture`}>
                                <VideocamIcon fontSize="small" style={{ marginLeft: -3 }} />
                                <p>화상 강의</p>
                                {hasVideoLecture ? <div className="live-streaming-mark">LIVE</div> : null}
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
            </StyleLeftNav>
        </>
    );
}

export default React.memo(withRouter(LeftNav));
