import {
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    FormControlLabel,
    FormGroup,
    Grid,
    makeStyles,
    Switch,
    TextField,
    withStyles,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import * as configs from '../../configs/config.json';
import moment from 'moment-timezone';
import { getServerDate } from '../../redux_modules/serverdate';
import isMobile from '../../controllers/isMobile';
import { NoLecturesCard } from './ListCards';
import CreateNewVideoLecture from './CreateNewVideoLecture';
import HeaderMenu from '../../AltridUI/HeaderMenu/HeaderMenu';
import AddCamstudyIcon from '../../AltridUI/Icons/AddCamstudyIcon';
import Button from '../../AltridUI/Button/Button';
import GroupBox from '../../AltridUI/GroupBox/GroupBox';
import VideoLectureListItem from './components/VideoLectureListItem';
import { closeAlertDialog, openAlertDialog, openAlertSnackbar } from '../../redux_modules/alertMaker';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}));

const DateTextField = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
        outline: 'none',
        margin: '8px 0 4px 0',
        '& .MuiInputBase-root': {
            fontSize: '0.9rem',
            outline: 'none',

            '&.Mui-focused': {
                backgroundColor: '#f2f3f6',
                boxShadow: '0 0 0 2px #8f8f8f',
            },
            '&.MuiInput-underline:before': {},

            '&.MuiInput-underline:after': {},
            '& input': {
                outline: 'none !important',
            },
        },
    },
}))(TextField);

const DialogActionButton = withStyles((theme) => ({
    root: {
        '& .MuiButton-label': {
            pointerEvents: 'none',
        },
    },
}))(Button);

const VideoLectureRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 32px;
    max-width: 960px;
    height: 100%;
    @media (max-width: 640px) {
        margin-top: 30px;
    }
`;

///////////////////////////////////////////////////////////////////////
const HeaderContainer = styled.div`
    display: flex;
    width: 100%;
`;
const ContentsWrapper = styled.div`
    margin-top: 32px;
    width: 100%;
`;

const GridResponsive = withStyles((theme) => ({
    'spacing-xs-2': {
        '@media (max-width: 640px)': {
            width: 'calc(100% + 8px)',
            margin: -4,
            '& .MuiGrid-item': {
                padding: 4,
            },
        },
    },
}))(Grid);

function VideoLecturesManage({ match, history }) {
    const classNum = match.params.num;
    const classes = useStyles();
    // 나중에 리덕스로 변경 예정
    const [currentVideoLectures, setCurrentVideoLectures] = useState({
        current: [],
        scheduled: [],
        done: [],
    });
    const serverdate = useSelector((state) => state.RdxServerDate);
    const sessions = useSelector((state) => state.RdxSessions);
    const currentClass = useSelector((state) => state.RdxCurrentClass);
    const [newVidLecDlgOpen, setNewVidLecDlgOpen] = useState(false);
    const [formFields, setFormFields] = useState({
        title: '',
        description: '',
        hasStartDate: false,
        startDate: moment().format('YYYY-MM-DDTHH:mm'),
        endDate: moment().add('days', 1).format('YYYY-MM-DDTHH:mm'),
        hasEyetrack: false,
    });
    const [formFieldsError, setFormFieldsError] = useState({
        title: false,
        description: false,
        endDate: false,
    });
    // const [ableState, setAbleState] = useState('ing');
    // const [scheduledIdxs, setScheduledIdxs] = useState([]);
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);

    const dispatch = useDispatch();

    // const handleNewVideoLectureDialogOpen = () => {
    //     setNewVidLecDlgOpen(true);
    // };

    const handleNewVideoLectureDialogClose = ({ target }) => {
        const { id } = target;
        if (id === 'new_video_lecture_confirm') {
            submitNewVideoLectures();
        } else {
            setNewVidLecDlgOpen(false);
        }
    };

    const handleFormChange = ({ target }, val2) => {
        const { name } = target;
        const value = target.value || val2;
        switch (name) {
            case 'hasStartDate':
                setFormFields({ ...formFields, [name]: value, startDate: moment().format('YYYY-MM-DDTHH:mm') });
                break;
            case 'startDate':
            case 'endDate':
                if (moment(value).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss')) {
                    setFormFieldsError({ ...formFieldsError, [name]: false });
                    setFormFields({ ...formFields, [name]: moment(value).format('YYYY-MM-DDTHH:mm') });
                }
                break;
            default:
                setFormFieldsError({ ...formFieldsError, [name]: false });
                setFormFields({ ...formFields, [name]: value });
                break;
        }
    };

    const submitNewVideoLectures = ({ title, description, startDate, endDate, hasStartDate, hasEyetrack }) => {
        if (!title || !title.trim()) {
            dispatch(openAlertSnackbar('강의 제목은 필수입니다.', 'warning'));
            return;
        }
        if (!description || !description.trim()) {
            dispatch(openAlertSnackbar('강의 설명은 필수입니다.', 'warning'));
            return;
        }
        if (!endDate || !endDate.trim()) {
            dispatch(openAlertSnackbar('종료 날짜를 설정해 주세요.', 'warning'));
            return;
        }

        Axios.post(
            `${configs.SERVER_HOST}/meeting-room`,
            {
                roomTitle: title,
                description: description,
                startDate: hasStartDate ? new Date(startDate).toUTCString() : null,
                endDate: new Date(endDate).toUTCString(),
                eyetrack: hasEyetrack,
                classNumber: classNum,
                maxJoinCount: currentClass.currentStudentsNumber + 1,
            },
            { withCredentials: true },
        )
            .then((res) => {
                setNewVidLecDlgOpen(false);
                console.log(res);
                history.replace();
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    openAlertSnackbar('화상 강의 개설 중 오류가 발생했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.', 'error'),
                );
            });
    };

    const enterVideoLecture = (data) => (event) => {
        dispatch(getServerDate());
        if (new Date(data.start_at).getTime() > serverdate.datetime) {
            dispatch(openAlertSnackbar('아직 세션이 시작되지 않았습니다.', 'warning'));
            return;
        }
        if (isMobile && data.eyetrack) {
            dispatch(
                openAlertSnackbar('모바일에서는 시선추적이 있는 강의는 입장이 불가합니다.\n데스크탑 또는 랩탑을 이용해 주세요.', 'error'),
            );
            return;
        }
        // 시선흐름 감시 기능이 있고, 학생인 경우, 시선추적 보정 창 띄움
        if (data.eyetrack && sessions.userType === 'students') {
            window.open(
                `/video-lecture-eyetracker/${classNum}?roomId=${data.room_id}`,
                'Gooroomee Biz_withEyetracker',
                `toolbar=no, scrollbars=no, resizable=no, status=no`,
                true,
            );
        }
        // 시선흐름 감시 기능이 있고, 선생님인 경우, 왼쪽에 화상 강의 창, 오른쪽엔 시선흐름 이상 감지 학생 목록 창을 분할하여 띄움
        else if (data.eyetrack && sessions.userType !== 'students') {
            let screenWidth = window.screen.availWidth;
            let screenHeight = window.screen.availHeight;
            // 시선흐름 감시 창
            window.open(
                `/video-lecture-detect-lists/${classNum}?roomId=${data.room_id}`,
                'Gooroomee Biz_withEyetracker',
                `width=${300}, height=${screenHeight}, left=${screenWidth - 300}, toolbar=no, scrollbars=no, resizable=no, status=no`,
                true,
            );
            // window.open(
            //     `/video-lecture-eyetracker/${classNum}?roomId=${data.room_id}`,
            //     'Gooroomee Biz_withEyetracker',
            //     `toolbar=no, scrollbars=no, resizable=no, status=no`,
            //     true,
            // );
        }
        // 시선흐름 감시 가능의 없는 경우 그냥 풀스크린으로 화상 강의 창 띄움
        else {
            // otp 생성
            Axios.post(
                `${configs.SERVER_HOST}/meeting-room/otp`,
                {
                    roomId: data.room_id,
                    username: sessions.userName,
                    roleId: sessions.userType === 'students' ? 'participant' : 'emcee',
                    ignorePasswd: true,
                    apiUserId: sessions.authId,
                },
                { withCredentials: true },
            )
                .then((res) => {
                    const otpCode = res.data.data.roomUserOtp.otp;
                    window.open(
                        `https://biz.gooroomee.com/room/otp/${otpCode}`,
                        'Gooroomee Biz',
                        `toolbar=no, scrollbars=no, resizable=no, status=no`,
                        true,
                    );
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(openAlertSnackbar('화상 강의에 입장하지 못했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.', 'error'));
                });
        }
    };

    const closeVideoLecture = (data) => (event) => {
        dispatch(
            openAlertDialog(
                'warning',
                '경고',
                '정말로 화상 강의를 닫으시겠습니까?',
                'no|yes',
                '아니오|예',
                'red|light',
                'white|light',
                'defaultClose',
                () => {
                    dispatch(closeAlertDialog());
                    Axios.delete(`${configs.SERVER_HOST}/meeting-room/${data.room_id}`, { withCredentials: true })
                        .then((res) => {
                            console.log(res);
                            history.replace();
                        })
                        .catch((err) => {
                            console.error(err);
                            dispatch(
                                openAlertSnackbar(
                                    '화상 강의를 닫는 중 오류가 발생했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.',
                                    'error',
                                ),
                            );
                        });
                },
            ),
        );
    };

    // const closeMultipleVideoLectures = () => {
    //     if (scheduledIdxs.length < 1) return;
    //     const conf = window.confirm('예약된 강의들을 취소하시겠습니까?');
    //     if (!conf) return;

    //     Axios.delete(`${configs.SERVER_HOST}/meeting-room`, {
    //         params: {
    //             roomIds: scheduledIdxs,
    //         },
    //         withCredentials: true,
    //     })
    //         .then((res) => {
    //             console.log(res);
    //             history.replace();
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             alert('화상 강의를 닫는 중 오류가 발생했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.');
    //         });
    // };

    // const handleTopMenuClick = ({ target }) => {
    //     const { name } = target;
    //     setAbleState(name);
    // };

    // const onScheduledCheckedChange = (targetIdx, checked) => {
    //     if (checked) {
    //         setScheduledIdxs([...scheduledIdxs, targetIdx]);
    //     } else {
    //         setScheduledIdxs(scheduledIdxs.filter((d, i) => d !== targetIdx));
    //     }
    // };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    useEffect(() => {
        if (!currentClass.currentVideoLectures) return;
        setCurrentVideoLectures(currentClass.currentVideoLectures);
    }, [currentClass.currentVideoLectures]);

    useEffect(() => {
        return () => {
            if (window.liveCountsInterval) {
                Object.keys(window.liveCountsInterval).forEach((key) => {
                    clearInterval(window.liveCountsInterval[key]);
                    delete window.liveCountsInterval[key];
                });
            }
        };
    }, []);

    const headerMenus = [
        {
            mId: 0,
            mName: '진행 중',
        },
        {
            mId: 1,
            mName: '완료됨',
        },
    ];
    const [menuStatus, setMenuStatus] = useState(0);
    const actionClickHeaderMenuItem = (menuId) => {
        window.scrollTo(0, 0);
        setMenuStatus(menuId);
    };
    const { leftNavGlobal } = useSelector((state) => state.RdxGlobalLeftNavState);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [gridMdBreakpoint, setGridMdBreakpoint] = useState(false);
    const [gridSmBreakpoint, setGridSmBreakpoint] = useState(false);
    useEffect(() => {
        const updateWindowDimensions = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', updateWindowDimensions);
        return () => window.removeEventListener('resize', updateWindowDimensions);
    }, []);

    useEffect(() => {
        if (screenWidth < 1100 && leftNavGlobal) {
            setGridMdBreakpoint(true);
        } else {
            setGridMdBreakpoint(false);
        }
        if (screenWidth > 902 && leftNavGlobal) setGridSmBreakpoint(true);
        else setGridSmBreakpoint(false);
    }, [screenWidth, leftNavGlobal]);

    const renderContentsByMenu = (id) => {
        switch (id) {
            case 0:
                return (
                    <>
                        <GroupBox
                            title={
                                <>
                                    현재 진행 중인 강의{' '}
                                    <span style={{ color: '#3AE2A1' }}>
                                        {currentVideoLectures.current.length ? currentVideoLectures.current.length : null}
                                    </span>
                                </>
                            }
                        >
                            {currentVideoLectures.current.length ? (
                                <GridResponsive container spacing={2}>
                                    {currentVideoLectures.current.map((d, i) => (
                                        <GridResponsive
                                            item
                                            key={d.room_id}
                                            md={gridMdBreakpoint ? 12 : 6}
                                            sm={gridSmBreakpoint ? 12 : 6}
                                            xs={12}
                                        >
                                            <VideoLectureListItem
                                                number={i}
                                                title={d.title}
                                                description={d.description}
                                                hasEyetrack={d.eyetrack}
                                                startDate={new Date(d.start_at)}
                                                endDate={new Date(d.end_at)}
                                                totalParticipants={currentClass.currentStudentsNumber}
                                                currentParticipants={d.liveCounts}
                                                status={0}
                                                userType={sessions.userType}
                                                serverDate={serverdate.datetime}
                                                onEntranceClick={enterVideoLecture(d)}
                                                onLectureCloseClick={closeVideoLecture(d)}
                                            />
                                        </GridResponsive>
                                    ))}
                                </GridResponsive>
                            ) : (
                                <NoLecturesCard />
                            )}
                        </GroupBox>
                        <GroupBox
                            title={
                                <>
                                    진행 예정인 강의{' '}
                                    <span style={{ color: '#3AE2A1' }}>
                                        {currentVideoLectures.scheduled.length ? currentVideoLectures.scheduled.length : null}
                                    </span>
                                </>
                            }
                            // style={{ marginTop: 90 }}
                            // rightComponent={
                            //     sessions.userType === 'students' ? null : (
                            //         <EdIconButton size="small" disableRipple onClick={closeMultipleVideoLectures}>
                            //             <DeleteIcon style={{ marginRight: 8 }} />
                            //             <span style={{ fontSize: '1rem', marginTop: 3 }}>선택 삭제</span>
                            //         </EdIconButton>
                            //     )
                            // }
                        >
                            {currentVideoLectures.scheduled.length ? (
                                <GridResponsive container spacing={2}>
                                    {currentVideoLectures.scheduled.map((d, i) => (
                                        <GridResponsive
                                            item
                                            key={d.room_id}
                                            md={gridMdBreakpoint ? 12 : 6}
                                            sm={gridSmBreakpoint ? 12 : 6}
                                            xs={12}
                                        >
                                            <VideoLectureListItem
                                                number={i}
                                                title={d.title}
                                                description={d.description}
                                                hasEyetrack={d.eyetrack}
                                                startDate={new Date(d.start_at)}
                                                endDate={new Date(d.end_at)}
                                                status={1}
                                                userType={sessions.userType}
                                                serverDate={serverdate.datetime}
                                                onLectureCloseClick={closeVideoLecture(d)}
                                            />
                                        </GridResponsive>
                                    ))}
                                </GridResponsive>
                            ) : (
                                <NoLecturesCard message="예정된 강의가 없습니다." />
                            )}
                        </GroupBox>
                    </>
                );
            case 1:
                return (
                    <GroupBox
                        title={
                            <>
                                완료된 강의{' '}
                                <span style={{ color: '#3AE2A1' }}>
                                    {currentVideoLectures.scheduled.length ? currentVideoLectures.scheduled.length : null}
                                </span>
                            </>
                        }
                    >
                        {currentVideoLectures.done.length ? (
                            <GridResponsive container spacing={2}>
                                {currentVideoLectures.done.map((d, i) => (
                                    <GridResponsive item key={d.idx} md={12} sm={12} xs={12}>
                                        <VideoLectureListItem
                                            key={d.room_id}
                                            number={i}
                                            title={d.title}
                                            description={d.description}
                                            hasEyetrack={d.eyetrack}
                                            startDate={new Date(d.start_at)}
                                            endDate={new Date(d.end_at)}
                                            status={2}
                                            userType={sessions.userType}
                                        />
                                    </GridResponsive>
                                ))}
                            </GridResponsive>
                        ) : (
                            <NoLecturesCard message="기록이 없습니다." />
                        )}
                    </GroupBox>
                );
            default:
                return <>렌더링 오류!</>;
        }
    };

    return (
        <>
            <Drawer anchor="right" open={openCreateNewDrawer}>
                <CreateNewVideoLecture handleClose={toggleDrawer(false)} onCreate={submitNewVideoLectures} />
            </Drawer>
            <Dialog
                open={newVidLecDlgOpen}
                onClose={handleNewVideoLectureDialogClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title">새 화상 강의</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormGroup>
                                <TextField
                                    autoFocus
                                    error={formFieldsError.title}
                                    margin="dense"
                                    id="title"
                                    name="title"
                                    label="강의 제목"
                                    type="text"
                                    helperText={formFieldsError.title ? '강의 제목 입력은 필수입니다.' : ''}
                                    onChange={handleFormChange}
                                    fullWidth
                                />
                                <TextField
                                    error={formFieldsError.description}
                                    margin="dense"
                                    id="description"
                                    name="description"
                                    label="강의 설명"
                                    type="text"
                                    helperText={formFieldsError.description ? '강의 설명은 필수입니다.' : ''}
                                    onChange={handleFormChange}
                                    fullWidth
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel
                                    labelPlacement="start"
                                    control={
                                        <Switch
                                            checked={formFields.hasStartDate}
                                            onChange={handleFormChange}
                                            name="hasStartDate"
                                            color="primary"
                                        />
                                    }
                                    label="시작 예약 설정"
                                />
                                <Collapse in={formFields.hasStartDate}>
                                    <DateTextField
                                        onChange={handleFormChange}
                                        value={formFields.startDate}
                                        id="startDate"
                                        name="startDate"
                                        type="datetime-local"
                                        className={classes.textField}
                                        label="세션 시작 날짜"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Collapse>
                                <DateTextField
                                    onChange={handleFormChange}
                                    value={formFields.endDate}
                                    id="endDate"
                                    name="endDate"
                                    type="datetime-local"
                                    className={classes.textField}
                                    label="세션 종료 날짜"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel
                                    labelPlacement="start"
                                    control={
                                        <Switch
                                            checked={formFields.hasEyetrack}
                                            onChange={handleFormChange}
                                            name="hasEyetrack"
                                            color="primary"
                                        />
                                    }
                                    label="시선 흐름 집중도 측정"
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <DialogActionButton onClick={handleNewVideoLectureDialogClose} id="new_video_lecture_cancel" color="default">
                        취소
                    </DialogActionButton>
                    <DialogActionButton onClick={handleNewVideoLectureDialogClose} id="new_video_lecture_confirm" color="primary">
                        만들기
                    </DialogActionButton>
                </DialogActions>
            </Dialog>

            <VideoLectureRoot>
                <HeaderContainer>
                    <HeaderMenu
                        title="화상 강의"
                        menuDatas={headerMenus}
                        selectedMenuId={menuStatus}
                        onItemClick={actionClickHeaderMenuItem}
                        rightComponent={
                            sessions.userType === 'teachers' ? (
                                <Button
                                    variant="filled"
                                    sizes="medium"
                                    colors="purple"
                                    leftIcon={<AddCamstudyIcon />}
                                    onClick={toggleDrawer(true)}
                                >
                                    새 화상 강의
                                </Button>
                            ) : null
                        }
                        fixed
                        backgroundColor="#f6f8f9"
                    />
                </HeaderContainer>
                <ContentsWrapper>{renderContentsByMenu(menuStatus)}</ContentsWrapper>
            </VideoLectureRoot>
        </>
    );
}

export default withRouter(VideoLecturesManage);
