/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import BackgroundTheme from '../../AltridUI/ThemeColors/BackgroundTheme';
import Typography from '../../AltridUI/Typography/Typography';
import Button from '../../AltridUI/Button/Button';
import { Drawer, Grid, withStyles } from '@material-ui/core';
import DraftCardItem from './components/DraftCardItem';
import { getDrafts } from '../../redux_modules/assignmentDraft';
import { apiUrl } from '../../configs/configs';
import { getClasses, getClassesError } from '../../redux_modules/classes';
import Axios from 'axios';
import * as $ from 'jquery';
import Error from '../Errors/Error';
import ClassDialogDelete from '../../components/essentials/ClassDialogDelete';
import CardPopOver from '../../components/essentials/CardPopOverShare';
import ClassDrawer from '../../components/essentials/ClassDrawer';

const DraftPageRoot = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2px 32px;
    margin: 0 auto 92px auto;
    max-width: 1216px;
    @media (max-width: 640px) {
        padding: 2px 16px;
    }
`;
//////////////////////////////////////////////////////////////////////////
const GreetingsSection = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;
const GreetingsLeftContainer = styled.div``;
const GreetingsTopAdornmentContainer = styled.div``;
const GreetingsTopAdornment = styled.svg`
    width: 71px;
    height: 47px;
    @media (max-width: 640px) {
        width: 42px;
        height: 28px;
    }
`;
const GreetingsMessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    & div.sub-message {
        margin-top: 8px;
    }
`;
const GreetingsRightContainer = styled.div``;
const GreetingsRightAdornment = styled.div`
    background-image: url('/bg_images/main_page/mainclass_icon.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 240px;
    width: 240px;
    @media (max-width: 640px) {
        height: 200px;
        width: 200px;
    }
`;
////////////////////////////////////////////////////////////////////////
const DraftListContainer = styled.div`
    @media (max-width: 640px) {
        margin-top: 8px;
    }
`;
const DraftListTopHeader = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    & button.btn-mobile {
        display: none;
    }
    @media (max-width: 640px) {
        & button.btn-desktop {
            display: none;
        }
        & button.btn-mobile {
            display: initial;
        }
    }
`;
const DraftListItemsContainer = styled.div`
    margin-top: 24px;
    @media (max-width: 640px) {
        margin-top: 12px;
    }
`;
////////////////////////////////////////////////////////////////////////
const BottomBannerContainer = styled.div`
    align-items: center;
    background-color: #f6f8f9;
    border: 1px solid #bfc6cd;
    border-radius: 32px;
    /* cursor: pointer; */
    color: #11171c;
    display: flex;
    margin-top: 40px;
    @media (max-width: 640px) {
        align-items: flex-start;
        flex-direction: column;
        padding: 24px 16px;
        margin-top: 32px;
    }
`;
const BottomBannerLeftContainer = styled.div`
    padding: 36px 24px 40px 40px;
    @media (max-width: 640px) {
        padding: 0;
    }
`;
const BottomBannerLeftIcon = styled.svg`
    width: 33px;
    height: 42px;
    @media (max-width: 640px) {
        height: 28px;
        margin-left: -4px;
    }
`;
const BottomBannerRightContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 32px 40px 32px 0;
    @media (max-width: 640px) {
        padding: 0;
        margin-top: 5px;
    }
`;
const BottomBannerTitle = styled.div``;
const BottomBannerTexts = styled.div`
    margin-top: 8px;
    @media (max-width: 640px) {
        margin-top: 4px;
    }
`;

const GridResponsive = withStyles((theme) => ({
    'spacing-xs-4': {
        '@media (max-width: 640px)': {
            width: 'calc(100% + 8px)',
            margin: -4,
            '& .MuiGrid-item': {
                padding: 4,
            },
        },
    },
}))(Grid);

function MainDraft({ match, history, cardData, children }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const { data, loading, error } = useSelector((state) =>
        state.assignmentDraft.draftDatas.data ? state.assignmentDraft.draftDatas : { loading: true, data: [], error: null },
    );

    // const { activedNum, num, idx } = match.params;

    // const [cardDatas, setCardDatas] = useState([]);
    const [stMatch, setStMatch] = useState({ id: null, path: null });
    const [errorState, setErrorState] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);
    const dispatch = useDispatch();
    const [dateDialogopen, setDateDialogopen] = useState(false);
    // const [selectClassState, setSelectClassState] = useState(null);
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

    // const handlePreviewClose = () => {
    //     setOpenPreview(false);
    // };
    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const [copyDialogopen, setCopyDialogopen] = useState(false);
    const handleCopyDialogOpen = (e) => {
        setCopyDialogopen(true);
        handleOptionClose();
    };

    // const handleDateDialogClose = (e) => {
    //     const { name } = e.target;
    //     const due_date = data ? data : null;

    //     if (name === 'button') {
    //         if (due_date && selectClassState) {
    //             //과제 게시하기 버튼 클릭

    //             setDateDialogopen(false);
    //             dispatch(postActived(cardData, selectClassState, due_date));
    //         } else if (!due_date) {
    //             alert('과제 기한 변경은 필수사항 입니다.');
    //         } else if (!selectClassState) {
    //             alert('클래스 선택은 필수사항 입니다.');
    //         }
    //     } else {
    //         setDateDialogopen(false);
    //     }
    // };

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
    if (errorState || error) return <Error />;
    return (
        <DraftPageRoot>
            <BackgroundTheme colors="#ffffff" />
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
            <GreetingsSection>
                <GreetingsLeftContainer>
                    <GreetingsTopAdornmentContainer>
                        <GreetingsTopAdornment viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                fill="#AEFFE0"
                            />
                        </GreetingsTopAdornment>
                    </GreetingsTopAdornmentContainer>
                    <GreetingsMessagesContainer>
                        <Typography type="heading" isHeadingComponent size="l" bold>
                            반갑습니다, {sessions.userName} 선생님!
                        </Typography>
                        <Typography className="sub-message" type="label" isHeadingComponent size="xxl" bold>
                            빠른 과제 생성을 통해 학습 성장을 경험해보세요
                        </Typography>
                    </GreetingsMessagesContainer>
                </GreetingsLeftContainer>
                <GreetingsRightContainer>
                    <GreetingsRightAdornment />
                </GreetingsRightContainer>
            </GreetingsSection>
            <DraftListContainer>
                <DraftListTopHeader>
                    <Typography type="heading" size="xs" bold>
                        {sessions.userName} 선생님의 과제 {loading ? '-' : data.length}개
                    </Typography>
                    <Button
                        className="btn-desktop"
                        variant="outlined"
                        colors="purple"
                        sizes="medium"
                        leftIcon={
                            <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 0.5H9C9.13261 0.5 9.25979 0.552678 9.35355 0.646447C9.44732 0.740215 9.5 0.867392 9.5 1V9C9.5 9.13261 9.44732 9.25979 9.35355 9.35355C9.25979 9.44732 9.13261 9.5 9 9.5H1C0.867392 9.5 0.740215 9.44732 0.646447 9.35355C0.552678 9.25979 0.5 9.13261 0.5 9V1C0.5 0.867392 0.552678 0.740215 0.646447 0.646447C0.740215 0.552678 0.867392 0.5 1 0.5ZM4.5 4.5H2.5V5.5H4.5V7.5H5.5V5.5H7.5V4.5H5.5V2.5H4.5V4.5Z" />
                            </svg>
                        }
                        onClick={toggleDrawer(true)}
                    >
                        과제 만들기
                    </Button>
                    <Button
                        className="btn-mobile"
                        variant="light"
                        colors="purple"
                        sizes="small"
                        leftIcon={
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    margin: '5.5px -3.5px',
                                }}
                            >
                                <path d="M1 0.5H9C9.13261 0.5 9.25979 0.552678 9.35355 0.646447C9.44732 0.740215 9.5 0.867392 9.5 1V9C9.5 9.13261 9.44732 9.25979 9.35355 9.35355C9.25979 9.44732 9.13261 9.5 9 9.5H1C0.867392 9.5 0.740215 9.44732 0.646447 9.35355C0.552678 9.25979 0.5 9.13261 0.5 9V1C0.5 0.867392 0.552678 0.740215 0.646447 0.646447C0.740215 0.552678 0.867392 0.5 1 0.5ZM4.5 4.5H2.5V5.5H4.5V7.5H5.5V5.5H7.5V4.5H5.5V2.5H4.5V4.5Z" />
                            </svg>
                        }
                        onClick={toggleDrawer(true)}
                    ></Button>
                </DraftListTopHeader>
                <DraftListItemsContainer>
                    {loading ? null : (
                        <GridResponsive container spacing={4}>
                            {Object.keys(data).map((i, idx) => (
                                <GridResponsive key={idx} item xs={12} sm={6} md={4}>
                                    <DraftCardItem testNum={data[i]['idx']} cardData={data[i]} />
                                </GridResponsive>
                            ))}
                        </GridResponsive>
                    )}
                </DraftListItemsContainer>
            </DraftListContainer>
            <BottomBannerContainer>
                <BottomBannerLeftContainer>
                    <BottomBannerLeftIcon viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.35941 31.9999C7.75949 29.4539 5.05278 27.3719 3.94181 25.9999C2.03942 23.6465 0.84717 20.8089 0.5024 17.8139C0.157631 14.8189 0.674369 11.7884 1.99309 9.07144C3.31181 6.35451 5.37886 4.0617 7.95614 2.45712C10.5334 0.852537 13.5161 0.00147064 16.5605 0.00195333C19.6049 0.00243602 22.5873 0.854449 25.1641 2.45984C27.7408 4.06524 29.8071 6.35871 31.125 9.07606C32.4428 11.7934 32.9586 14.8241 32.6128 17.819C32.2671 20.8139 31.0739 23.6511 29.1708 26.0039C28.0598 27.3739 25.3572 29.4559 24.7572 31.9999H8.35739H8.35941ZM24.6381 35.9999V37.9999C24.6381 39.0608 24.2124 40.0782 23.4548 40.8284C22.6972 41.5785 21.6696 41.9999 20.5982 41.9999H12.5185C11.447 41.9999 10.4195 41.5785 9.66183 40.8284C8.90421 40.0782 8.47858 39.0608 8.47858 37.9999V35.9999H24.6381ZM18.5783 16.0099V7.99995L9.48855 20.0099H14.5384V28.0099L23.6281 16.0099H18.5783Z"
                            fill="#2D3843"
                        />
                    </BottomBannerLeftIcon>
                </BottomBannerLeftContainer>
                <BottomBannerRightContainer>
                    <BottomBannerTitle>
                        <Typography type="label" size="xxl" bold>
                            과제 최소 조건을 맞추면 유형별 분석이 가능합니다.
                        </Typography>
                    </BottomBannerTitle>
                    <BottomBannerTexts>
                        <Typography type="label" size="xl">
                            유형별 분석이 가능한 과제를 생성시, 더 많은 리포트 정보를 받아보실 수 있습니다.
                        </Typography>
                    </BottomBannerTexts>
                </BottomBannerRightContainer>
            </BottomBannerContainer>
        </DraftPageRoot>
    );
}

MainDraft.defaultProps = {};

export default MainDraft;
