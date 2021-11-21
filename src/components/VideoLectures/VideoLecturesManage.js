import {
    Button as MuiButton,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Drawer,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    makeStyles,
    Switch,
    TextField,
    Tooltip,
    withStyles,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { apiUrl } from '../../configs/configs';
import ClassWrapper from '../essentials/ClassWrapper';
import moment from 'moment-timezone';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import GroupIcon from '@material-ui/icons/Group';
import FaceIcon from '@material-ui/icons/Face';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { getServerDate } from '../../redux_modules/serverdate';
import isMobile from '../../controllers/isMobile';
import { CurrentVideoLectureCard, LogsVideoLectureCard, NoLecturesCard, ScheduledVideoLectureCard } from './ListCards';
import CreateNewVideoLecture from './CreateNewVideoLecture';
import HeaderMenu from '../../AltridUI/HeaderMenu/HeaderMenu';
import AddCamstudyIcon from '../../AltridUI/Icons/AddCamstudyIcon';
import Button from '../../AltridUI/Button/Button';
import Groupbox from '../../AltridUI/GroupBox/Groupbox';
import VideoLectureListItem from './components/VideoLectureListItem';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}));

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        padding: '0.5rem 1rem',
        marginTop: '-0.1rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        borderRadius: '5px',
    },
}))(Tooltip);

const OpenNewVidLec = styled.div`
    margin-top: 100px;
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-self: flex-start;

    & h1 {
        color: #706d6d;
        font-size: 2.4rem;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.06;
        letter-spacing: -2.75px;
        text-align: left;

        margin-bottom: 1.5rem;
    }
    & button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 1.2rem 1.5rem;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        margin-top: 30px;
        border-radius: 10px;
        cursor: pointer;
        background-color: #ff5c5cd9;

        & p {
            font-size: 1.125rem;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: -1.2px;
            text-align: left;
            color: #ffffff;

            margin-right: 1rem;
        }
    }
`;

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

const EntranceButton = withStyles((theme) => ({
    root: {
        color: '#00BB35',
        fontSize: '1.2rem',

        '&:hover': {
            backgroundColor: '#CEF4C8',
        },
    },
}))(Button);

const EdPaper = styled.div`
    box-sizing: border-box;
    padding: 1rem;
    width: 100%;
    min-height: 60px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    position: relative;

    div.top-icons {
        position: absolute;
        top: 0.9rem;
        right: 0.9rem;

        & button {
            & svg {
                font-size: 1rem;
            }

            & + button {
                margin-left: 0.5rem;
            }
        }
    }

    div.infos-container {
        width: 100%;

        h4 {
            color: #333333;
        }

        p {
            color: #666666;
            margin-top: 0.5rem;
        }

        div.bottom-container {
            color: #666666;
            font-size: 0.8rem;
            margin-top: 0.667rem;

            div.element {
                display: flex;

                div.icon-item {
                    display: flex;
                    align-items: center;

                    &.live-counts {
                        color: #ff0000;
                        transition: all 0.3s;

                        &.no-participants {
                            color: #999999;
                        }
                    }

                    &.error {
                        color: #ff5c5c;
                    }

                    & svg {
                        margin-right: 0.333rem;
                    }

                    & + div.icon-item {
                        margin-left: 1.2rem;
                    }
                }

                & + div.element {
                    margin-top: 0.333rem;
                }
            }
        }
    }

    div.entrance-container {
        display: flex;
        align-items: center;
    }
`;

const ButtonAble = styled.button`
    color: ${(props) => (props.able ? '#3B168A' : '#b2b2b2')};
    border-bottom: ${(props) => (props.able ? '2px solid #3B168A' : 'none')};
`;

const VideoLectureRoot = styled.div`
    & .class-share-header {
        display: flex;
        align-items: center;
        margin-bottom: 54px;
        width: 100%;

        & div.left {
            display: inherit;

            & .header-title {
                font-size: 1.75rem;
                font-weight: 600;
                margin-right: 50px;
            }
            & .header-menu {
                display: flex;

                & > button {
                    font-size: 1.12rem;
                    font-weight: 500;
                    background-color: transparent;
                    padding: 5px;
                }
                & > button + button {
                    margin-left: 25px;
                }
            }
        }

        & div.right {
            display: inherit;
            margin-left: auto;
        }

        @media (min-width: 0) and (max-width: 767px) {
            flex-direction: column;
            margin-bottom: 42px;

            & div.left {
                width: 100%;
                & .header-title {
                    font-size: 1.5rem;
                }
            }
            & div.right {
                width: 100%;
                margin: initial;
                margin-top: 24px;
            }
        }
    }
`;

const StyledButton = styled.button`
    &.video-lecture {
        background-color: #707070;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 500;
        color: white;
        padding: 12px 0;
        border-radius: 11px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);
        width: 96px;

        &.main {
            background-color: #3f1990;
            width: 96px;
        }
        &.sub {
            background-color: #6d2bf5;
            width: 190px;
        }

        & svg.MuiSvgIcon-root {
            margin-right: 12px;
            font-size: 1rem;
        }

        @media (min-width: 0) and (max-width: 767px) {
            &,
            &.main,
            &.sub {
                width: 100%;
            }
        }
    }
`;

const EdIconButton = withStyles((theme) => ({
    root: {
        padding: 0,
        '&:hover': {
            backgroundColor: '#ffffff00',
        },
    },
}))(IconButton);

const HeaderBox = styled.header`
    align-items: flex-end;
    border-bottom: 1px solid rgba(112, 112, 112, 0.7);
    color: #000;
    display: flex;
    flex-direction: row;
    font-weight: 500;
    justify-content: space-between;
    padding: 6px 2px 6px 2px;
    margin-bottom: 16px;

    & h5.title {
        font-size: 1.25rem;
        font-weight: 500;
    }

    & div.right-comp {
        margin-left: auto;
    }

    & svg.open-commentary-dropdown-icon {
        cursor: pointer;
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
    const [ableState, setAbleState] = useState('ing');
    const [scheduledIdxs, setScheduledIdxs] = useState([]);
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);

    const dispatch = useDispatch();

    const handleNewVideoLectureDialogOpen = () => {
        setNewVidLecDlgOpen(true);
    };

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
            return alert('강의 제목은 필수입니다.');
        }
        if (!description || !description.trim()) {
            return alert('강의 설명은 필수입니다.');
        }
        if (!endDate || !endDate.trim()) {
            return alert('종료 날짜를 설정해 주세요.');
        }

        Axios.post(
            `${apiUrl}/meeting-room`,
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
                alert('화상 강의 개설 중 오류가 발생했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.');
            });
    };

    const enterVideoLecture = (data) => (event) => {
        dispatch(getServerDate());
        if (new Date(data.start_at).getTime() > serverdate.datetime) return alert('아작 세션이 시작되지 않은 강의 입니다.');
        if (isMobile && data.eyetrack)
            return alert('모바일에서는 시선추적이 있는 강의는 입장이 불가합니다.\n데스크탑 또는 랩탑을 이용해 주세요.');
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
                `${apiUrl}/meeting-room/otp`,
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
                    alert('화상 강의에 입장하지 못했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.');
                });
        }
    };

    const closeVideoLecture = (data) => (event) => {
        const conf = window.confirm('정말로 화상 강의를 닫으시겠습니까?');
        if (!conf) return;

        Axios.delete(`${apiUrl}/meeting-room/${data.room_id}`, { withCredentials: true })
            .then((res) => {
                console.log(res);
                history.replace();
            })
            .catch((err) => {
                console.error(err);
                alert('화상 강의를 닫는 중 오류가 발생했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.');
            });
    };

    const closeMultipleVideoLectures = () => {
        if (scheduledIdxs.length < 1) return;
        const conf = window.confirm('예약된 강의들을 취소하시겠습니까?');
        if (!conf) return;

        Axios.delete(`${apiUrl}/meeting-room`, {
            params: {
                roomIds: scheduledIdxs,
            },
            withCredentials: true,
        })
            .then((res) => {
                console.log(res);
                history.replace();
            })
            .catch((err) => {
                console.error(err);
                alert('화상 강의를 닫는 중 오류가 발생했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.');
            });
    };

    const handleTopMenuClick = ({ target }) => {
        const { name } = target;
        setAbleState(name);
    };

    const onScheduledCheckedChange = (targetIdx, checked) => {
        if (checked) {
            setScheduledIdxs([...scheduledIdxs, targetIdx]);
        } else {
            setScheduledIdxs(scheduledIdxs.filter((d, i) => d !== targetIdx));
        }
    };

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
            mName: '진행 완료',
        },
    ];
    const [menuStatus, setMenuStatus] = useState(0);
    const actionClickHeaderMenuItem = (menuId) => {
        setMenuStatus(menuId);
    };

    const renderContentsByMenu = (id) => {
        switch (id) {
            case 0:
                return (
                    <>
                        <Groupbox title="현재 진행 중인 강의">
                            {currentVideoLectures.current.length ? (
                                <Grid container spacing={2}>
                                    {currentVideoLectures.current.map((d, i) => (
                                        <Grid item key={d.room_id} lg={6} md={12} sm={12} xs={12}>
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
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <NoLecturesCard />
                            )}
                        </Groupbox>
                        <Groupbox
                            title="진행 예정인 강의"
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
                                <Grid container spacing={2}>
                                    {currentVideoLectures.scheduled.map((d, i) => (
                                        <Grid item key={d.room_id} lg={6} md={12} sm={12} xs={12}>
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
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <NoLecturesCard message="예정된 강의가 없습니다." />
                            )}
                        </Groupbox>
                    </>
                );
            case 1:
                return (
                    <Groupbox title="완료된 화상 강의">
                        {currentVideoLectures.done.length ? (
                            <Grid container spacing={2}>
                                {currentVideoLectures.done.map((d, i) => (
                                    <Grid item key={d.idx} md={12} sm={12} xs={12}>
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
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <NoLecturesCard message="기록이 없습니다." />
                        )}
                    </Groupbox>
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
                <ClassWrapper col="col">
                    {/* <div className="class-share-header">
                        <div className="left">
                            <div className="header-title">화상 강의</div>
                            <div className="header-menu">
                                <ButtonAble name="ing" able={ableState === 'ing'} value={ableState} onClick={handleTopMenuClick}>
                                    진행 중
                                </ButtonAble>
                                {sessions.userType === 'students' ? null : (
                                    <ButtonAble name="done" able={ableState === 'done'} value={ableState} onClick={handleTopMenuClick}>
                                        진행 완료
                                    </ButtonAble>
                                )}
                            </div>
                        </div>
                        <div className="right">
                            {sessions.userType === 'students' ? null : (
                                <StyledButton className="video-lecture sub" onClick={toggleDrawer(true)}>
                                    <AddCircleOutlineIcon fontSize="small" />새 화상 강의 만들기
                                </StyledButton>
                            )}
                        </div>
                    </div> */}
                    <HeaderContainer>
                        <HeaderMenu
                            title="화상 강의"
                            menuDatas={headerMenus}
                            selectedMenuId={menuStatus}
                            onItemClick={actionClickHeaderMenuItem}
                            rightComponent={
                                <Button
                                    variant="filled"
                                    sizes="medium"
                                    colors="purple"
                                    leftIcon={<AddCamstudyIcon />}
                                    onClick={toggleDrawer(true)}
                                >
                                    새 화상강의 만들기
                                </Button>
                            }
                        />
                    </HeaderContainer>
                    <ContentsWrapper>{renderContentsByMenu(menuStatus)}</ContentsWrapper>
                </ClassWrapper>
            </VideoLectureRoot>
        </>
    );
}

export default withRouter(VideoLecturesManage);
