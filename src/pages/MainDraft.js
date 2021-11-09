import React, { useState, useEffect, useRef } from 'react';
import CardDraft from '../components/ClassDraft/CardDraft';
import CardAddNew from '../components/essentials/CardAddNew';
import CardLists from '../components/essentials/CardLists';
import CardRoot from '../components/essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../components/essentials/ClassDrawer';
// import ClassHeaderBox from '../essentials/ClassHeaderBox';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import TypeBanner from '../components/essentials/TypeBanner';
import ClassWrapper from '../components/essentials/ClassWrapper';
import HeaderBar from '../components/essentials/HeaderBar';
import '../styles/class.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getDrafts } from '../redux_modules/assignmentDraft';
import { getClasses, getClassesError } from '../redux_modules/classes';
import BackdropComponent2 from '../components/essentials/BackdropComponent2';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import styled from 'styled-components';
import getAchieveValueForTypes from '../components/essentials/GetAchieveValueForTypes';
import Footer from '../components/essentials/Footer';
import Error from './Error';
import isMobile from '../controllers/isMobile';
import MobileBody from '../components/essentials/MobileBody';
import { postActived } from '../redux_modules/assignmentActived';
import icon_image from '../images/mainclass_icon.png';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CardPopOver from '../../src/components/essentials/CardPopOver';
import ClassDialogDelete from '../components/essentials/ClassDialogDelete';
import * as $ from 'jquery';

const Item = styled.div``;

const Main_header = styled.div`
    margin: 0 112px;

    & .greeting {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 260px;
        margin-bottom: 16px;

        & h2 {
            font-weight: 700;
            font-size: 56px;
            line-height: 60px;
            margin-bottom: 8px;
            margin-top: 16px;
        }
    }
`;
const CardSection = styled.div`
    font-family: 'inter, -apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, “Helvetica Neue”, Arial, sans-serif, “Apple Color Emoji”, “Segoe UI Emoji”, “Segoe UI Symbol”';
    margin: 24px 112px;
    & .card {
        & .cards {
            cursor: pointer;
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
            min-height: 248px;
            border-radius: 32px;
            background: #f4f1fa;
            color: #200656;
            padding: 0 32px;
            padding-top: 32px;
        }
        & .draft-cards {
            color: black;
            min-height: 248px;
            background: #ffffff;
            border: 1px solid #e9edef;
            border-radius: 32px;
            box-shadow: none;

            & .check-list {
                display: flex;
                align-items: center;
                align-content: center;
                margin-bottom: 8px;
                & .option {
                    margin-left: 4px;
                }
                & .eyetracker {
                    & p {
                        margin-left: 5px;
                    }
                    display: flex;
                    background: #d4e2fc;
                    padding: 4px 6px;
                    border-radius: 8px;
                    margin-right: 8px;
                    align-items: center;
                }
                & .possible {
                    & p {
                        margin-left: 5px;
                    }
                    background: #e3ddf2;
                    border-radius: 8px;
                    display: flex;
                    padding: 4px 6px;
                    align-items: center;
                }
            }

            & span {
                font-size: 16px;
                font-weight: bold;
                line-height: 20px;
            }

            & .title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: bold;
                font-size: 24px;
                height: 28px;
            }
            & .description {
                height: 22px;
                font-weight: bold;
                white-space: nowrap;
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 8px;
                margin-bottom: 16px;
            }
            & .time-limit {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            & .num {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            & .update {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            & .count {
                display: flex;
                justify-content: space-between;
                padding-bottom: 8px;
            }
        }
        & .Add-Class {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            & p {
                color: #3b1689;
                font-size: 24px;
                font-weight: 700;
                margin-top: 14px;
            }
        }
    }
`;

const Info = styled.div`
    margin: 32px 112px;

    & .Info-total {
        margin-bottom: 80px;
        padding: 36px 40px;
        display: flex;
        align-items: center;

        height: 124px;
        background: #f6f8f9;
        border: 1px solid #bfc6cd;
        box-sizing: border-box;
        border-radius: 32px;
        & span {
            margin-right: 6px;
        }
        & .Info-Word {
            margin-left: 23px;
            & .Info-Top {
                font-weight: bold;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: -0.02em;
            }
            & .Info-Bottom {
                font-size: 18px;
                line-height: 22px;
                letter-spacing: -0.02em;
                margin-top: 8px;
            }
        }
    }
`;

function MainDraft({ match, cardData, history }) {
    const testRef = useRef();
    const { data, loading, error } = useSelector((state) =>
        state.assignmentDraft.draftDatas.data ? state.assignmentDraft.draftDatas : { loading: true, data: [], error: null },
    );

    const { activedNum, num, idx } = match.params;

    const sessions = useSelector((state) => state.RdxSessions);
    const [cardDatas, setCardDatas] = useState([]);
    const [stMatch, setStMatch] = useState({ id: null, path: null });
    const [errorState, setErrorState] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);
    const dispatch = useDispatch();
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [selectClassState, setSelectClassState] = useState(null);
    const [deleteDialogopen, setDeleteDialogopen] = useState(false);

    const handleDeleteDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'yes') {
            handleClassDelete(name);
            setDeleteDialogopen(false);
        } else {
            setDeleteDialogopen(false);
        }
    };

    const handlePreTest = (e) => {
        const $target = $(e.target);
        if (!($target.parents('.card-option').length || $target.attr('class') === 'card-option')) {
            handlePreviewOpen();
        }
    };
    const handleOptionClose = () => {
        setAnchorEl(null);
    };

    const handlePreviewOpen = () => {
        handleOptionClose();
        if (cardData['contents_data'].flatMap((m) => m.problemDatas).length === 0) {
            return alert('과제 수정을 통해 에디터에서 문항을 추가해주세요 !');
        }
        setOpenPreview(true);
    };

    const handleDeleteDialogOpen = () => {
        setDeleteDialogopen(true);
        handleOptionClose();
    };

    const handleDialogOpen = (type) => {
        setDateDialogopen(true);
        handleOptionClose();
    };

    const handlePreviewClose = () => {
        setOpenPreview(false);
    };
    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const [copyDialogopen, setCopyDialogopen] = useState(false);
    const handleCopyDialogOpen = (e) => {
        setCopyDialogopen(true);
        handleOptionClose();
    };

    const handleDateDialogClose = (e) => {
        const { name } = e.target;
        const due_date = data ? data : null;

        if (name === 'button') {
            if (due_date && selectClassState) {
                //과제 게시하기 버튼 클릭

                setDateDialogopen(false);
                dispatch(postActived(cardData, selectClassState, due_date));
            } else if (!due_date) {
                alert('과제 기한 변경은 필수사항 입니다.');
            } else if (!selectClassState) {
                alert('클래스 선택은 필수사항 입니다.');
            }
        } else {
            setDateDialogopen(false);
        }
    };

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;

        if (sessions.userType === 'students') {
            setErrorState(true);
        }
        setStMatch({ ...stMatch, id: match.params.id, path: match.path });

        if (sessions.userType === 'teachers') {
            dispatch(getDrafts());

            Axios.get(`${apiUrl}/classes/current`, { withCredentials: true })
                .then((res) => {
                    dispatch(getClasses(res.data));
                })
                .catch((err) => {
                    dispatch(getClassesError(err));
                });
        }
        return () => {};
    }, [sessions.authId, sessions.academyName]);

    /** 수강생 데이터 처리 */
    const handleStudentInClass = (name) => {
        //수정의 경우 : 학생 데이터 없는 경우-> delete만 진행 // 있는 경우 -> delete 후 post작업 진행
        //삭제의 경우 : 무조건 delete

        Axios.delete(`${apiUrl}/assignment-draft/${sessions.authId}`, { withCredentials: true })
            .then((res1) => {
                // // 수정버튼 클릭시
                // if (name === 'modify') {
                //     //수강생이 있는 경우에만, post 작업
                //     if (inputState.entry_new_students.length === 0) {
                //         alert('클래스 정보 수정이 완료되었습니다!');
                //     } else {
                //         Axios.post(
                //             `${apiUrl}/students-in-class`,
                //             {
                //                 classNumber: num,
                //                 students: inputState.entry_new_students,
                //             },
                //             { withCredentials: true },
                //         )
                //             .then((res2) => {
                //                 alert('클래스 정보 수정이 완료되었습니다!');
                //             })
                //             .catch((err) => {
                //                 console.error(err);
                //             });
                //     }
                //     history.replace(`/class/${num}/manage`);
                // }
                // // 삭제버튼 클릭시, 삭제만 진행
                // else {
                console.log(res1);
                alert('삭제 완료되었습니다!');
                history.replace('/');
                //}
            })
            .catch((err) => {
                console.error(err);
            });
    };

    /** 과제 데이터 삭제 */
    const handleClassDelete = (name) => {
        Axios.delete(`${apiUrl}/assignment-draft/${sessions.authId}`, { withCredentials: true })
            .then((res) => {
                //class table - name, description 삭제 완료!
                handleStudentInClass(name); //수강생 데이터 처리...
            })
            .catch((err) => {
                console.error(err);
            });
    };

    /** draft.js 자체 메소드 */
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    if (isMobile) return <MobileBody />;
    if (errorState) return <Error />;
    return (
        <>
            <ClassDialogDelete ver="draft" open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />
            <CardPopOver
                // contents_data={cardData['contents_data']}
                handlePreTest={handlePreTest}
                handleDialogOpen={handleDialogOpen}
                handleDeleteDialogOpen={handleDeleteDialogOpen}
                handleDrawerOpen={toggleDrawer(true)}
                handleOptionClick={handleOptionClick}
                handleOptionClose={handleOptionClose}
                handleThisCopy={handleCopyDialogOpen}
                anchorEl={anchorEl}
            />
            <Drawer anchor="right" open={openCreateNewDrawer}>
                <ClassDrawer handleClose={toggleDrawer(false)} ver="draft" />
            </Drawer>
            <HeaderBar />
            <Main_header>
                <div className="greeting">
                    <div className="left">
                        <svg width="71" height="47" viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                fill="#AEFFE0"
                            />
                        </svg>

                        <h2>반갑습니다 {sessions.userName} 선생님</h2>
                        <h3>빠른 과제 생성을 통해 학습 성장을 경험해보세요</h3>
                    </div>
                    <div className="right">
                        <img width="339px" height="260px" src={icon_image} alt="dashboard_icons"></img>
                    </div>
                </div>
                <h3>
                    {sessions.userName} 선생님의 과제 {data.length} 개
                </h3>
            </Main_header>
            <CardSection>
                <div className="card">
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={4}>
                                <Item>
                                    <div onClick={toggleDrawer(true)} className="cards Add-Class">
                                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M2 0H34C34.5304 0 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2V34C36 34.5304 35.7893 35.0391 35.4142 35.4142C35.0391 35.7893 34.5304 36 34 36H2C1.46957 36 0.960859 35.7893 0.585786 35.4142C0.210714 35.0391 0 34.5304 0 34V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0ZM16 16H8V20H16V28H20V20H28V16H20V8H16V16Z"
                                                fill="#957FCE"
                                            />
                                        </svg>

                                        <p> 과제 생성 </p>
                                    </div>
                                </Item>
                            </Grid>

                            {data.map((data, index) => {
                                return (
                                    <Grid key={index} item xs={4}>
                                        <Item>
                                            <div className="cards draft-cards">
                                                <div className="check-list">
                                                    {data.eyetrack === 1 ? (
                                                        <>
                                                            <div className="eyetracker">
                                                                <svg
                                                                    width="12"
                                                                    height="10"
                                                                    viewBox="0 0 12 10"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M0.59082 5C1.06082 2.44 3.30432 0.5 6.00032 0.5C8.69632 0.5 10.9393 2.44 11.4098 5C10.9398 7.56 8.69632 9.5 6.00032 9.5C3.30432 9.5 1.06132 7.56 0.59082 5ZM6.00032 7.5C6.66336 7.5 7.29925 7.23661 7.76809 6.76777C8.23693 6.29893 8.50032 5.66304 8.50032 5C8.50032 4.33696 8.23693 3.70107 7.76809 3.23223C7.29925 2.76339 6.66336 2.5 6.00032 2.5C5.33728 2.5 4.70139 2.76339 4.23255 3.23223C3.76371 3.70107 3.50032 4.33696 3.50032 5C3.50032 5.66304 3.76371 6.29893 4.23255 6.76777C4.70139 7.23661 5.33728 7.5 6.00032 7.5ZM6.00032 6.5C5.6025 6.5 5.22096 6.34196 4.93966 6.06066C4.65836 5.77936 4.50032 5.39782 4.50032 5C4.50032 4.60218 4.65836 4.22064 4.93966 3.93934C5.22096 3.65804 5.6025 3.5 6.00032 3.5C6.39815 3.5 6.77968 3.65804 7.06098 3.93934C7.34229 4.22064 7.50032 4.60218 7.50032 5C7.50032 5.39782 7.34229 5.77936 7.06098 6.06066C6.77968 6.34196 6.39815 6.5 6.00032 6.5Z"
                                                                        fill="#174291"
                                                                    />
                                                                </svg>

                                                                <p>시선흐름 분석 포함</p>
                                                            </div>
                                                        </>
                                                    ) : null}

                                                    <div className="possible">
                                                        <svg
                                                            width="12"
                                                            height="7"
                                                            viewBox="0 0 12 7"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M5.801 4.87976L6.507 5.58576L10.74 1.35276L11.447 2.05976L6.507 6.99976L3.325 3.81776L4.032 3.11076L5.0945 4.17326L5.801 4.87926V4.87976ZM5.802 3.46576L8.278 0.989258L8.983 1.69426L6.507 4.17076L5.802 3.46576ZM4.3885 6.29326L3.682 6.99976L0.5 3.81776L1.207 3.11076L1.9135 3.81726L1.913 3.81776L4.3885 6.29326Z"
                                                                fill="#3B1689"
                                                            />
                                                        </svg>
                                                        <p>유형별 분석 가능</p>
                                                    </div>
                                                    <div onClick={handleOptionClick} className="option">
                                                        <svg
                                                            width="15"
                                                            height="14"
                                                            viewBox="0 0 15 14"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M7.57096 13.6668C3.88896 13.6668 0.904297 10.6822 0.904297 7.00016C0.904297 3.31816 3.88896 0.333496 7.57096 0.333496C11.253 0.333496 14.2376 3.31816 14.2376 7.00016C14.2376 10.6822 11.253 13.6668 7.57096 13.6668ZM6.9063 9.66683L11.6196 4.95283L10.677 4.01016L6.9063 7.7815L5.0203 5.8955L4.07763 6.83816L6.9063 9.66683Z"
                                                                fill="#3B1689"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="title">{data.title}</div>
                                                <div className="description">{data.description}</div>
                                                <div className="num">
                                                    <p>문항수</p>
                                                    {/* <span>{data.contents_data[index].problemDatas.length} 문제 </span> */}
                                                </div>
                                                <div className="time-limit">
                                                    <p>제한 시간</p>
                                                    {data.time_limit < 0 ? (
                                                        <span>제한 시간 없음</span>
                                                    ) : (
                                                        <span>{Math.floor(data.time_limit / 60)} 분</span>
                                                    )}
                                                </div>
                                                <div className="update">
                                                    <p>최종 수정</p>
                                                    <span>{moment(data.updated).format('MM월 DD일 HH시 mm분')}</span>
                                                </div>
                                                <div className="count">
                                                    <p>게시 수</p>
                                                    {data.actived_count === 0 ? <span>미게시</span> : <span>{data.actived_count}</span>}
                                                </div>
                                            </div>
                                        </Item>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </div>
            </CardSection>
            <Info>
                <div className="Info-total">
                    <div className="Info-icon">
                        <svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.35941 31.9999C7.75949 29.4539 5.05278 27.3719 3.94181 25.9999C2.03942 23.6465 0.84717 20.8089 0.5024 17.8139C0.157631 14.8189 0.674369 11.7884 1.99309 9.07144C3.31181 6.35451 5.37886 4.0617 7.95614 2.45712C10.5334 0.852537 13.5161 0.00147064 16.5605 0.00195333C19.6049 0.00243602 22.5873 0.854449 25.1641 2.45984C27.7408 4.06524 29.8071 6.35871 31.125 9.07606C32.4428 11.7934 32.9586 14.8241 32.6128 17.819C32.2671 20.8139 31.0739 23.6511 29.1708 26.0039C28.0598 27.3739 25.3572 29.4559 24.7572 31.9999H8.35739H8.35941ZM24.6381 35.9999V37.9999C24.6381 39.0608 24.2124 40.0782 23.4548 40.8284C22.6972 41.5785 21.6696 41.9999 20.5982 41.9999H12.5185C11.447 41.9999 10.4195 41.5785 9.66183 40.8284C8.90421 40.0782 8.47858 39.0608 8.47858 37.9999V35.9999H24.6381ZM18.5783 16.0099V7.99995L9.48855 20.0099H14.5384V28.0099L23.6281 16.0099H18.5783Z"
                                fill="#2D3843"
                            />
                        </svg>
                    </div>
                    <div className="Info-Word">
                        <div className="Info-Top">과제 최소 조건을 맞추면 유형별 분석이 가능합니다.</div>
                        <div className="Info-Bottom">유형별 분석이 가능한 과제를 생성시, 더 많은 리포트 정보를 받아보실 수 있습니다.</div>
                    </div>
                </div>
            </Info>
            {/* <HeaderBar />
            <BackdropComponent2 open={loading && !data.length} blind="#f7f9f8" />
            <Drawer anchor="right" open={openCreateNewDrawer}>
                <ClassDrawer handleClose={toggleDrawer(false)} ver="draft" />
            </Drawer>

            <div className="draft-header"></div>

            <div className="class-page-root" style={{ minHeight: '0' }}>
                <div style={{ paddingTop: '80px' }} className="class-section-root">
                    <div className="class-draft-header">
                        <h2>
                            빠른 과제 생성을 통해<br></br>학습 성장을 경험해보세요.
                        </h2>
                    </div>
                    <div className="class-draft-card">
                        <CardLists
                            upperDeck={
                                <div style={{ color: 'white', fontSize: '20px' }} className="class-title">
                                    <b>{sessions.userName}</b> 선생님의 과제 <b>{data.length}개</b>
                                </div>
                            }
                        >
                            <CardRoot cardHeight="281px">
                                <CardAddNew onClick={toggleDrawer(true)}>과제 생성</CardAddNew> //과제 생성 
                            </CardRoot>

                            {Object.keys(data).map((i, idx) => (
                                <CardRoot key={idx} cardHeight="281px">
                                    <CardDraft testNum={data[i]['idx']} cardData={data[i]} />
                                </CardRoot>
                            ))}
                        </CardLists>
                    </div>
                </div>
            </div>
            <ClassWrapper col="none" type="main_page">
                <StyleHr className="draft-footer"></StyleHr>
                <InfoBanner href="https://www.notion.so/07bd3c8f53ac4e449242cda7eccdcb4e" alt="more_analysis" target="_blank">
                    <div className="banner-root">
                        <div className="banner-top">
                            <BsExclamationTriangleFill />
                            과제 최소 조건을 맞추면 유형별 분석이 가능합니다!
                        </div>
                        <div className="banner-central">
                            유형별 분석이 가능한 과제를 생성시, 더 많은 리포트 정보를 받아보실 수 있습니다.
                        </div>
                        <div className="banner-footer">
                            자세히 알아보기 <IoIosArrowForward style={{ marginRight: '5px' }} />
                        </div>
                    </div>
                </InfoBanner>
            </ClassWrapper> */}
            <Footer />
        </>
    );
}

export default withRouter(React.memo(MainDraft));
