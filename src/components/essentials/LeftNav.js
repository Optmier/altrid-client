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
import { getClassLists } from '../../redux_modules/classLists';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MuiAccordion from '@material-ui/core/Accordion';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ClassWrapper from './ClassWrapper';

const Contents = styled.div`
    background: #eff3fe;
    height: 1200px;
    position: fixed;
    z-index: 1299;
    width: 392px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & .container {
        & .back {
            margin-top: 24px;
        }
        margin: 0 32px;
        & .title {
            margin-top: 32px;
            & h2 {
                font-weight: 700;
                line-height: 44px;
            }
            & p {
                margin-bottom: 16px;
                font-weight: 400;
                line-height: 22px;
            }
        }
        & .class_info {
            display: flex;
            text-align: center;
            margin-bottom: 16px;

            & .student_num {
                display: flex;
                flex-direction: column;
                background: #ffffff;
                width: 162px;
                height: 92px;
                border-radius: 16px;
                margin: 3px;
                padding: 12px 32px 12px 32px;
                
                & span{
                    font-size:40px;
                    font-weight:700;
                 
                }
                & .icons{
                    display:flex;
                    align-items:center;
                    text-align:center;
                    justify-content: center;
                    & p{
                        margin-left:4px;
                    }
                }
            }
        }
        & .create_assignment {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 12px 24px;
            width: 328px;
            height: 46px;
            border: 1.5px solid #6c46a1;
            box-sizing: border-box;
            border-radius: 104px;
            text-align: center;
            color: #6c46a1;
            font-weight: 700;
            line-height: 22px;
            font-size: 18px;
            & p {
                margin: 0 8px;
            }
        }

        & .menu-title {
            margin-top: 80px;
            font-size: 18px;
            font-weight: 700px;
                & span{
                    font-size:18px;
                    font-weightL700;
                    margin-bottom:8px;
                }
            & .menu{
                & .item{
                    display: flex;
                    justify-content:space-between;
                    flex-direction:row;
                    align-items:center;
                    align-content:center;
                    width: 328px;
                    height: 52px;
                    background: #FFFFFF;
                    border-radius: 16px;    
                    margin: 4px 0px;
                    & .arrow{
                        margin-right:21px;
                    }
                    & .content-name{
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        align-content:center;
                        &  .name{
                            font-size:16px;
                            font-weight:400;
                            margin: 0px 12px;
                        }
                        & .video-lecture{
                            margin-left:17px;
                        }
                        &  .draft-button{
                            margin-left:16px;
                        } 
                        & .student-option{
                            margin-left:10px;
                        } 
                    }
                    

                }
                &  .item:hover{
                    background:#957FCE;
                }
                & .item:visited{
                    background:black;
                }
            }
        }
        
    }
`;
// const StyleLeftNav = styled.div`
//     transition: all 0.4s;

//     @media (min-width: 903px) {
//         width: 392px;
//         left: ${(props) => (props.leftNavState ? '0' : '-392px')};
//     }

//     @media (min-width: 0) and (max-width: 902px) {
//         width: 100%;
//         left: ${(props) => (props.leftNavState ? '0' : '-100%')};
//     }
// `;
window.liveCountsInterval = {};
// const GoClass = styled.div`
//     background-color: #6d2afa;
//     border-radius: 11px;
//     box-shadow: 0px 3px 6px #84848412;
//     width: 100%;
//     height: 45px;
//     font-size: 14.4px;
//     font-weight: 500;
//     display: flex;
//     align-items: center;
//     justify-content: center;
// `;

// const StylePopOver = styled.div`
//     display: flex;
//     flex-direction: column;
//     & .header {
//         font-size: 0.76rem;
//         font-weight: 600;
//         color: #8b8989;
//         border-bottom: 1px solid #e0e0e0;
//         padding: 0.6rem 2rem;
//     }

//     & .left-a-active {
//         & .row {
//             & .check {
//                 display: block;
//                 margin-left: 1.3rem;
//             }
//         }
//     }
//     & .row {
//         padding: 0.7rem 1.6rem;
//         display: flex;
//         align-items: center;

//         & .check {
//             display: none;
//         }
//         & > svg {
//             margin-right: 28px;
//         }

//         & .contents {
//             display: flex;
//             flex-direction: column;

//             & .name {
//                 font-size: 1rem;
//                 font-weight: 600;
//                 color: black;
//                 display: flex;
//             }
//             & .desc {
//                 font-size: 0.85rem;
//                 font-weight: 400;
//                 color: #8b8989;

//                 max-width: 150px;
//                 min-width: 100px;
//                 text-overflow: ellipsis;
//                 white-space: nowrap;
//                 overflow: hidden;
//             }
//         }
//     }
//     & .row:hover {
//         background-color: #80808054;
//     }
// `;

// const GotoClass = styled.div`
//     padding: 0 5px;
//     display: flex;
//     font-size: 14px;
//     align-items: center;
//     justify-content: flex-start;
//     font-weight: 500;
//     font-family: 'Noto Sans CJK KR', 'Montserrat';
// `;
// const Item = styled.div`
//     display: flex;
// `;

// const ClassList = styled.div`
//     overflow: scroll;
//     height: 100px;
//     width: 130%;
// `;

const LeftNavItem = React.memo(function LeftNavItem({ linkTo, children }) {
    return (
        <NavLink to={linkTo} activeClassName="left-a-active">
            <div className="left-nav-item">{children}</div>
        </NavLink>
    );
});

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    border: 'none',
    background: 'transparent',
    color: 'white',
    // '&:hover':{
    //     background:'RGB(73, 52, 143)',
    //   },
}));

function LeftNav({ match, history, leftNavState, handleLeftNav, setLeftNavState }) {
    const { num, id } = match.params;
    /** redux-module 불러내기 */
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.assignmentDraft.draftDatas);
    const sessions = useSelector((state) => state.RdxSessions);
    const serverdate = useSelector((state) => state.RdxServerDate);
    const classLists = useSelector((state) => state.classLists);

    const setStudentsNumber = useCallback((studentsNumber) => dispatch(setStudentsNum(studentsNumber)));
    const setVideoLectures = useCallback((videoLecture) => dispatch(setCurrentVideoLectures(videoLecture)));
    const updateVideoLiveCounts = useCallback((roomId, liveCounts) => dispatch(updateLiveCounts(roomId, liveCounts)));

    const [studentData, setStudentData] = useState([]);
    const [teacherData, setTeacherData] = useState({});
    const [hasVideoLecture, setHasVideoLecture] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [codestate, setCodeState] = useState('');
    const [assignment, setassignment] = useState('');
    const open = Boolean(anchorEl);
    const popoverId = open ? 'simple-popover' : undefined;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const fetchClassLists = () => {
        Axios.get(`${apiUrl}/classes/current`, { withCredentials: true })
            .then((res) => {
                dispatch(getClassLists(res.data));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName || !serverdate.datetime) return;

        Axios.get(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
            .then((res) => {
                setStudentData(res.data);
                setStudentsNumber(res.data.length || 0);
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
            }, []);

        fetchClassLists();

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

    useEffect(() => {
        Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
            .then((res1) => {
                setCodeState(res1.data[0].class_code);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
    useEffect(() => {
        Axios.get(`${apiUrl}/assignment-actived/${num}`, { withCredentials: true }).then((result) => setassignment(result.data));
    }, []);

    return (
        <>
            <Contents>
                <div className="container">
                    <div className="back">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="16" fill="#F6F8F9" />
                            <path
                                d="M19.828 23.0002H32V25.0002H19.828L25.192 30.3642L23.778 31.7782L16 24.0002L23.778 16.2222L25.192 17.6362L19.828 23.0002Z"
                                fill="#4D5C6A"
                            />
                        </svg>
                    </div>
                    <div className="title">
                        <h2>{teacherData.class_name}</h2>
                        <p>{teacherData.description}</p>
                    </div>
                    <div className="class_info">
                        <div className="student_num">
                            <span>{studentData.length}</span>
                            <div className="icons">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.333008 14.6665C0.333008 13.252 0.894911 11.8955 1.89511 10.8953C2.8953 9.89507 4.25185 9.33317 5.66634 9.33317C7.08083 9.33317 8.43738 9.89507 9.43758 10.8953C10.4378 11.8955 10.9997 13.252 10.9997 14.6665H0.333008ZM5.66634 8.6665C3.45634 8.6665 1.66634 6.8765 1.66634 4.6665C1.66634 2.4565 3.45634 0.666504 5.66634 0.666504C7.87634 0.666504 9.66634 2.4565 9.66634 4.6665C9.66634 6.8765 7.87634 8.6665 5.66634 8.6665ZM10.575 10.1552C11.5948 10.4173 12.5059 10.9944 13.1786 11.8044C13.8513 12.6144 14.2513 13.616 14.3217 14.6665H12.333C12.333 12.9265 11.6663 11.3425 10.575 10.1552ZM9.22634 8.63784C9.78501 8.13815 10.2318 7.52606 10.5374 6.84167C10.843 6.15727 11.0005 5.41603 10.9997 4.6665C11.0011 3.75548 10.7681 2.85942 10.323 2.0645C11.0781 2.21623 11.7573 2.62475 12.2453 3.22063C12.7333 3.81652 12.9998 4.56299 12.9997 5.33317C12.9999 5.80815 12.8985 6.27768 12.7024 6.71029C12.5063 7.1429 12.22 7.5286 11.8627 7.84153C11.5054 8.15447 11.0853 8.38741 10.6306 8.52475C10.1759 8.66208 9.69715 8.70064 9.22634 8.63784Z"
                                        fill="#4D5C6A"
                                    />
                                </svg>
                                <p>학생수</p>
                            </div>
                        </div>
                        <div className="student_num">
                            <span>{assignment.length}</span>
                            <div className="icons">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2.00033 9.00016V1.00016C2.00033 0.823352 2.07056 0.653782 2.19559 0.528758C2.32061 0.403734 2.49018 0.333496 2.66699 0.333496H13.3337C13.5105 0.333496 13.68 0.403734 13.8051 0.528758C13.9301 0.653782 14.0003 0.823352 14.0003 1.00016V11.6668C14.0003 12.1973 13.7896 12.706 13.4145 13.081C13.0395 13.4561 12.5308 13.6668 12.0003 13.6668H2.66699C2.13656 13.6668 1.62785 13.4561 1.25278 13.081C0.877706 12.706 0.666992 12.1973 0.666992 11.6668V10.3335H11.3337V11.6668C11.3337 11.8436 11.4039 12.0132 11.5289 12.1382C11.6539 12.2633 11.8235 12.3335 12.0003 12.3335C12.1771 12.3335 12.3467 12.2633 12.4717 12.1382C12.5968 12.0132 12.667 11.8436 12.667 11.6668V9.00016H2.00033Z"
                                        fill="#4D5C6A"
                                    />
                                </svg>
                                <p>게시 과제</p>
                            </div>
                        </div>
                    </div>

                    {sessions.userType === 'students' ? null : (
                        <>
                            <LeftNavItem linkTo={`/main-draft`}>
                                <div className="create_assignment">
                                    <div className="draft-button">
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M5.00046 0C5.13307 0 5.26024 0.0526784 5.35401 0.146447C5.44778 0.240215 5.50046 0.367392 5.50046 0.5V2C5.50046 2.13261 5.44778 2.25979 5.35401 2.35355C5.26024 2.44732 5.13307 2.5 5.00046 2.5C4.86785 2.5 4.74067 2.44732 4.6469 2.35355C4.55314 2.25979 4.50046 2.13261 4.50046 2V0.5C4.50046 0.367392 4.55314 0.240215 4.6469 0.146447C4.74067 0.0526784 4.86785 0 5.00046 0ZM5.00046 7.5C5.13307 7.5 5.26024 7.55268 5.35401 7.64645C5.44778 7.74021 5.50046 7.86739 5.50046 8V9.5C5.50046 9.63261 5.44778 9.75979 5.35401 9.85355C5.26024 9.94732 5.13307 10 5.00046 10C4.86785 10 4.74067 9.94732 4.6469 9.85355C4.55314 9.75979 4.50046 9.63261 4.50046 9.5V8C4.50046 7.86739 4.55314 7.74021 4.6469 7.64645C4.74067 7.55268 4.86785 7.5 5.00046 7.5ZM9.33046 2.5C9.39676 2.61484 9.41473 2.75131 9.38041 2.8794C9.34609 3.00749 9.26229 3.11669 9.14746 3.183L7.84846 3.933C7.79157 3.96635 7.72865 3.98812 7.66332 3.99705C7.59799 4.00598 7.53154 4.0019 7.46779 3.98505C7.40404 3.96819 7.34425 3.9389 7.29187 3.89884C7.23949 3.85879 7.19555 3.80877 7.16258 3.75166C7.12961 3.69456 7.10826 3.6315 7.09976 3.56611C7.09126 3.50072 7.09578 3.43429 7.11305 3.37065C7.13033 3.30702 7.16002 3.24743 7.20042 3.19531C7.24083 3.1432 7.29113 3.09959 7.34846 3.067L8.64746 2.317C8.7623 2.2507 8.89877 2.23273 9.02686 2.26705C9.15494 2.30137 9.26415 2.38516 9.33046 2.5ZM2.83546 6.25C2.90176 6.36484 2.91973 6.50131 2.88541 6.6294C2.85109 6.75749 2.76729 6.86669 2.65246 6.933L1.35346 7.683C1.29657 7.71635 1.23365 7.73812 1.16832 7.74705C1.10299 7.75598 1.03653 7.7519 0.972785 7.73505C0.909035 7.71819 0.849249 7.6889 0.796869 7.64884C0.744488 7.60879 0.700547 7.55877 0.667576 7.50166C0.634606 7.44456 0.613256 7.3815 0.604757 7.31611C0.596257 7.25072 0.600776 7.18429 0.618053 7.12065C0.63533 7.05702 0.665024 6.99743 0.705425 6.94531C0.745825 6.8932 0.796136 6.84959 0.853458 6.817L2.15246 6.067C2.2673 6.0007 2.40377 5.98273 2.53186 6.01705C2.65994 6.05137 2.76915 6.13516 2.83546 6.25ZM9.33046 7.5C9.26415 7.61484 9.15494 7.69863 9.02686 7.73295C8.89877 7.76727 8.7623 7.7493 8.64746 7.683L7.34846 6.933C7.23455 6.86622 7.15169 6.75711 7.11794 6.62946C7.08419 6.50181 7.1023 6.366 7.16832 6.25165C7.23434 6.13731 7.3429 6.05372 7.47033 6.01913C7.59775 5.98453 7.73368 6.00174 7.84846 6.067L9.14746 6.817C9.26229 6.88331 9.34609 6.99251 9.38041 7.1206C9.41473 7.24869 9.39676 7.38516 9.33046 7.5ZM2.83546 3.75C2.76915 3.86484 2.65994 3.94863 2.53186 3.98295C2.40377 4.01727 2.2673 3.9993 2.15246 3.933L0.853458 3.183C0.796136 3.15041 0.745825 3.1068 0.705425 3.05469C0.665024 3.00257 0.63533 2.94298 0.618053 2.87935C0.600776 2.81571 0.596257 2.74928 0.604757 2.68389C0.613256 2.6185 0.634606 2.55544 0.667576 2.49834C0.700547 2.44123 0.744488 2.39121 0.796869 2.35116C0.849249 2.3111 0.909035 2.2818 0.972785 2.26495C1.03653 2.2481 1.10299 2.24402 1.16832 2.25295C1.23365 2.26188 1.29657 2.28365 1.35346 2.317L2.65246 3.067C2.76729 3.13331 2.85109 3.24251 2.88541 3.3706C2.91973 3.49869 2.90176 3.63516 2.83546 3.75Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div className="name">
                                        <p>과제 생성 및 게시</p>
                                    </div>
                                </div>
                            </LeftNavItem>
                        </>
                    )}
                    <div className="menu-title">
                        <span>메뉴</span>
                        <div className="menu">
                            <LeftNavItem linkTo={`/class/${num}/share`}>
                                <div className="item">
                                    <div className="content-name">
                                        <div className="draft-button">
                                            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M0.666992 1.3275C0.668517 1.10865 0.756076 0.899181 0.910753 0.744348C1.06543 0.589515 1.27481 0.501746 1.49366 0.5H16.507C16.9637 0.5 17.3337 0.870833 17.3337 1.3275V14.6725C17.3321 14.8914 17.2446 15.1008 17.0899 15.2557C16.9352 15.4105 16.7258 15.4983 16.507 15.5H1.49366C1.27434 15.4998 1.06407 15.4125 0.909067 15.2573C0.754061 15.1022 0.666992 14.8918 0.666992 14.6725V1.3275ZM9.00033 2.16667V13.8333H15.667V2.16667H9.00033ZM9.83366 3.83333H14.8337V5.5H9.83366V3.83333ZM9.83366 6.33333H14.8337V8H9.83366V6.33333Z"
                                                    fill="#3B1689"
                                                />
                                            </svg>
                                        </div>
                                        <div className="name">
                                            <p>과제 게시판</p>
                                        </div>
                                    </div>
                                    <div className="arrow">
                                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M3.78145 4.99999L0.481445 1.69999L1.42411 0.757324L5.66678 4.99999L1.42411 9.24266L0.481445 8.29999L3.78145 4.99999Z"
                                                fill="#C1B5E3"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </LeftNavItem>

                            <LeftNavItem linkTo={`/class/${num}/vid-lecture`}>
                                <div className="item">
                                    <div className="content-name">
                                        <div className="draft-button">
                                            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M5.16699 17.5002V16.6085C3.77855 16.4077 2.50892 15.7135 1.59066 14.6529C0.672394 13.5923 0.166979 12.2364 0.166992 10.8335V6.66683C0.166992 5.90078 0.317876 5.14224 0.611028 4.43451C0.904181 3.72678 1.33386 3.08371 1.87554 2.54204C2.41721 2.00036 3.06027 1.57068 3.76801 1.27753C4.47574 0.98438 5.23428 0.833496 6.00033 0.833496C6.76637 0.833496 7.52491 0.98438 8.23265 1.27753C8.94038 1.57068 9.58344 2.00036 10.1251 2.54204C10.6668 3.08371 11.0965 3.72678 11.3896 4.43451C11.6828 5.14224 11.8337 5.90078 11.8337 6.66683V10.8335C11.8337 12.2364 11.3283 13.5923 10.41 14.6529C9.49173 15.7135 8.2221 16.4077 6.83366 16.6085V17.5002H10.167V19.1668H1.83366V17.5002H5.16699ZM6.00033 7.50016C5.77931 7.50016 5.56735 7.41236 5.41107 7.25608C5.25479 7.0998 5.16699 6.88784 5.16699 6.66683C5.16699 6.44582 5.25479 6.23385 5.41107 6.07757C5.56735 5.92129 5.77931 5.8335 6.00033 5.8335C6.22134 5.8335 6.4333 5.92129 6.58958 6.07757C6.74586 6.23385 6.83366 6.44582 6.83366 6.66683C6.83366 6.88784 6.74586 7.0998 6.58958 7.25608C6.4333 7.41236 6.22134 7.50016 6.00033 7.50016ZM6.00033 9.16683C6.66337 9.16683 7.29925 8.90344 7.76809 8.4346C8.23693 7.96575 8.50033 7.32987 8.50033 6.66683C8.50033 6.00379 8.23693 5.3679 7.76809 4.89906C7.29925 4.43022 6.66337 4.16683 6.00033 4.16683C5.33729 4.16683 4.7014 4.43022 4.23256 4.89906C3.76372 5.3679 3.50033 6.00379 3.50033 6.66683C3.50033 7.32987 3.76372 7.96575 4.23256 8.4346C4.7014 8.90344 5.33729 9.16683 6.00033 9.16683Z"
                                                    fill="#3B1689"
                                                />
                                            </svg>
                                        </div>
                                        <div className="name video-lecture">
                                            <p>{''}화상 강의</p>
                                        </div>
                                    </div>
                                    <div className="arrow">
                                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M3.78145 4.99999L0.481445 1.69999L1.42411 0.757324L5.66678 4.99999L1.42411 9.24266L0.481445 8.29999L3.78145 4.99999Z"
                                                fill="#C1B5E3"
                                            />
                                        </svg>
                                    </div>

                                    {hasVideoLecture ? <div className="live-streaming-mark">LIVE</div> : null}
                                </div>
                            </LeftNavItem>

                            {sessions.userType === 'students' ? null : (
                                <LeftNavItem linkTo={`/class/${num}/manage`}>
                                    <div className="item">
                                        <div className="content-name">
                                            <div className="draft-button">
                                                <svg
                                                    width="18"
                                                    height="16"
                                                    viewBox="0 0 18 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M3.44463 1.78772C4.30024 1.02129 5.30521 0.440215 6.3963 0.0810547C6.70828 0.471908 7.10435 0.787412 7.55507 1.00411C8.00578 1.22081 8.49954 1.33313 8.99963 1.33272C9.49973 1.33313 9.99349 1.22081 10.4442 1.00411C10.8949 0.787412 11.291 0.471908 11.603 0.0810547C12.6941 0.440215 13.699 1.02129 14.5546 1.78772C14.3726 2.25309 14.2976 2.7535 14.3354 3.2518C14.3732 3.75009 14.5228 4.23347 14.773 4.66605C15.0226 5.09946 15.3668 5.47101 15.7799 5.75307C16.1929 6.03513 16.6642 6.22044 17.1588 6.29522C17.3926 7.4193 17.3926 8.57947 17.1588 9.70355C16.1921 9.85189 15.3005 10.4202 14.773 11.3327C14.5226 11.7654 14.373 12.2489 14.3352 12.7474C14.2974 13.2458 14.3724 13.7464 14.5546 14.2119C13.699 14.978 12.694 15.5588 11.603 15.9177C11.2909 15.527 10.8948 15.2117 10.4441 14.9951C9.99338 14.7786 9.49967 14.6664 8.99963 14.6669C8.49954 14.6665 8.00578 14.7788 7.55507 14.9955C7.10435 15.2122 6.70828 15.5277 6.3963 15.9186C5.30527 15.5596 4.30032 14.9789 3.44463 14.2127C3.62684 13.7472 3.70183 13.2467 3.66404 12.7482C3.62624 12.2498 3.47662 11.7662 3.2263 11.3336C2.97654 10.9003 2.63234 10.5289 2.21929 10.247C1.80623 9.96509 1.33495 9.77991 0.840467 9.70522C0.606563 8.58087 0.606563 7.42041 0.840467 6.29605C1.33502 6.22127 1.80635 6.03596 2.21942 5.7539C2.63248 5.47185 2.97664 5.1003 3.2263 4.66689C3.47649 4.2343 3.62604 3.75092 3.66384 3.25263C3.70163 2.75434 3.62671 2.25393 3.44463 1.78855V1.78772ZM10.2496 10.1644C10.5362 10.0014 10.7878 9.78339 10.9898 9.52282C11.1918 9.26225 11.3403 8.9643 11.4267 8.64612C11.513 8.32794 11.5356 7.99581 11.4931 7.66886C11.4506 7.34191 11.3439 7.02659 11.179 6.74107C11.0142 6.45554 10.7945 6.20544 10.5326 6.00517C10.2707 5.8049 9.97175 5.65841 9.653 5.57414C9.33425 5.48987 9.00198 5.46948 8.67532 5.51414C8.34866 5.55881 8.03406 5.66764 7.74963 5.83439C7.18012 6.16826 6.76578 6.71385 6.59704 7.35209C6.4283 7.99033 6.51886 8.6694 6.84895 9.24112C7.17904 9.81284 7.72187 10.2308 8.35897 10.4038C8.99608 10.5767 9.67574 10.4907 10.2496 10.1644Z"
                                                        fill="#3B1689"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="name student-option">
                                                <p>학생 및 클래스 관리</p>
                                            </div>
                                        </div>
                                        <div className="arrow">
                                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M3.78145 4.99999L0.481445 1.69999L1.42411 0.757324L5.66678 4.99999L1.42411 9.24266L0.481445 8.29999L3.78145 4.99999Z"
                                                    fill="#C1B5E3"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </LeftNavItem>
                            )}
                        </div>
                    </div>
                </div>
            </Contents>

            {/* <StyleLeftNav leftNavState={leftNavState} className="left-nav-root">
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
                                    <>
                                        <div className="info-num">
                                            <img alt="student_num" src={People} />
                                            <p>학생 수 {studentData.length}명</p>
                                        </div>
                                        <div className="info-num">
                                            <FileCopyIcon fontSize="small" />
                                            <p> &nbsp; &nbsp; {codestate} </p>
                                        </div>
                                    </>
                                )}
                            </>
                        </div>

                        {sessions.userType === 'students' ? null : (
                            <>
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
                                <Accordion>
                                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                                        <Typography>
                                            <GotoClass>
                                                <ExitToAppIcon fontSize="small" />
                                                &nbsp; &nbsp; 클래스 바로가기
                                            </GotoClass>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {classLists.map((i) => (
                                                <LeftNavItem key={i.idx} linkTo={`/class/${i.idx}/share`}>
                                                    <div className="name">
                                                        <Item>
                                                            <ChevronRightIcon /> {i.name}
                                                        </Item>
                                                    </div>
                                                    <br />
                                                </LeftNavItem>
                                            ))}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        )}
                    </div>
                    <div className="left-nav-box">
                        {sessions.userType === 'students' ? (
                            <>
                                <div className="a-wrapper">
                                    <LeftNavItem linkTo={`dashboard`}>
                                        <CalendarTodayIcon fontSize="small" />
                                        <p>대시보드</p>
                                    </LeftNavItem>
                                </div>
                            </>
                        ) : null}

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
                        {sessions.userType === 'students' ? (
                            <div className="a-wrapper">
                                <LeftNavItem linkTo={`/class/${num}/learning-vocas`}>
                                    <p>단어장 (임시)</p>
                                </LeftNavItem>
                            </div>
                        ) : null}
                        {sessions.userType === 'students' ? (
                            <div className="a-wrapper">
                                <LeftNavItem linkTo={`/class/${num}/cam-study`}>
                                    <p>캠스터디 (임시)</p>
                                </LeftNavItem>
                            </div>
                        ) : null}

                        {sessions.userType === 'students' ? null : (
                            <>
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

                                        <p>학생 및 클래스 관리</p>
                                    </LeftNavItem>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </StyleLeftNav> */}
        </>
    );
}

export default React.memo(withRouter(LeftNav));
