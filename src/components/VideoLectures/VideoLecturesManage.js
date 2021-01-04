import {
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import React, { useEffect, useState } from 'react';
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
import { getServerDate } from '../../redux_modules/serverdate';

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

function VideoLecturesManage({ match, history }) {
    window.hhistory = history;
    const classNum = match.params.num;
    const classes = useStyles();
    // 나중에 리덕스로 변경 예정
    const [currentVideoLecture, setCurrentVideoLecture] = useState(null);
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
    const [itemHovered, setItemHovered] = useState(false);
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

    const submitNewVideoLectures = () => {
        let formFieldsPassed = true;
        let titleCheck = false;
        let descCheck = false;
        let endDateCheck = false;
        if (!formFields.title || !formFields.title.trim()) {
            titleCheck = true;
            formFieldsPassed = false;
        }
        if (!formFields.description || !formFields.description.trim()) {
            descCheck = true;
            formFieldsPassed = false;
        }
        if (!formFields.endDate || !formFields.endDate.trim()) {
            endDateCheck = true;
            formFieldsPassed = false;
        }
        setFormFieldsError({
            ...formFieldsError,
            title: titleCheck,
            description: descCheck,
            endDate: endDateCheck,
        });
        if (!formFieldsPassed) return;

        Axios.post(
            `${apiUrl}/meeting-room`,
            {
                roomTitle: formFields.title,
                description: formFields.description,
                startDate: formFields.hasStartDate ? new Date(formFields.startDate).toUTCString() : null,
                endDate: new Date(formFields.endDate).toUTCString(),
                eyetrack: formFields.hasEyetrack,
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

    const enterVideoLecture = () => {
        dispatch(getServerDate());
        if (new Date(currentVideoLecture.start_at).getTime() > serverdate.datetime) return alert('아작 세션이 시작되지 않은 강의 입니다.');
        // 시선흐름 감시 기능이 있고, 학생인 경우, 시선추적 보정 창 띄움
        if (currentVideoLecture.eyetrack && sessions.userType === 'students') {
            window.open(
                `/video-lecture-eyetracker/${classNum}?roomId=${currentVideoLecture.room_id}`,
                'Gooroomee Biz_withEyetracker',
                `toolbar=no, scrollbars=no, resizable=no, status=no`,
                true,
            );
        }
        // 시선흐름 감시 기능이 있고, 선생님인 경우, 왼쪽에 화상 강의 창, 오른쪽엔 시선흐름 이상 감지 학생 목록 창을 분할하여 띄움
        else if (currentVideoLecture.eyetrack && sessions.userType !== 'students') {
            let screenWidth = window.screen.availWidth;
            let screenHeight = window.screen.availHeight;
            // 시선흐름 감시 창
            window.open(
                `/video-lecture-detect-lists/${classNum}?roomId=${currentVideoLecture.room_id}`,
                'Gooroomee Biz_withEyetracker',
                `width=${300}, height=${screenHeight}, left=${screenWidth - 300}, toolbar=no, scrollbars=no, resizable=no, status=no`,
                true,
            );
            // window.open(
            //     `/video-lecture-eyetracker/${classNum}?roomId=${currentVideoLecture.room_id}`,
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
                    roomId: currentVideoLecture.room_id,
                    username: sessions.userName,
                    roleId: sessions.userType === 'students' ? 'participant' : 'emcee',
                    ignorePasswd: true,
                    apiUserId: sessions.authId,
                },
                { withCredentials: true },
            )
                .then((res) => {
                    const otpCode = res.data.data.roomUserOtp.otp;
                    console.log(otpCode);
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

    const closeVideoLecture = () => {
        const conf = window.confirm('정말로 화상 강의를 닫으시겠습니까?');
        if (!conf) return;

        Axios.delete(`${apiUrl}/meeting-room/${currentVideoLecture.room_id}`, { withCredentials: true })
            .then((res) => {
                console.log(res);
                history.replace();
            })
            .catch((err) => {
                console.error(err);
                alert('화상 강의를 닫는 중 오류가 발생했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.');
            });
    };

    useEffect(() => {
        if (!currentClass.currentVideoLecture) return;
        const endDateTime = new Date(currentClass.currentVideoLecture.end_at).getTime();
        if (endDateTime < serverdate.datetime) return;
        setCurrentVideoLecture(currentClass.currentVideoLecture);
    }, [currentClass.currentVideoLecture]);
    return (
        <>
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
                                {/* <FormControlLabel
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
                                /> */}
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
            <ClassWrapper col="col">
                {currentVideoLecture ? (
                    <div className="class-manage-root">
                        <div>
                            <div className="manage-header">
                                <h2 className="manage-title">현재 진행 중인 화상 강의</h2>
                                <p className="manage-subTitle">입장 전 반드시 정보 확인 바랍니다.</p>
                            </div>
                            <EdPaper
                                onMouseEnter={() => {
                                    if (sessions.userType === 'students') return;
                                    setItemHovered(0);
                                }}
                                onMouseLeave={() => {
                                    if (sessions.userType === 'students') return;
                                    setItemHovered(false);
                                }}
                            >
                                {itemHovered === 0 ? (
                                    <div className="top-icons">
                                        {/* <IconButton size="small">
                                            <EditIcon fontSize="inherit" />
                                        </IconButton> */}
                                        <IconButton size="small" onClick={closeVideoLecture}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </div>
                                ) : null}
                                <div className="infos-container">
                                    <h4 className="title">{currentVideoLecture.title}</h4>
                                    <p className="description">{currentVideoLecture.description}</p>
                                    <div className="bottom-container">
                                        <div className="element">
                                            <HtmlTooltip
                                                title={
                                                    new Date(currentVideoLecture.end_at).getTime() - serverdate.datetime < 1800000
                                                        ? '세션이 곧 종료됩니다.'
                                                        : '세션 시작일 ~ 세션 종료일'
                                                }
                                            >
                                                <div
                                                    className={`icon-item date${
                                                        new Date(currentVideoLecture.end_at).getTime() - serverdate.datetime < 1800000
                                                            ? ' error'
                                                            : ''
                                                    }`}
                                                >
                                                    <DateRangeOutlinedIcon fontSize="inherit" />
                                                    {moment(currentVideoLecture.start_at).format('YYYY년 MM월 DD일 HH시 mm분')} ~{' '}
                                                    {moment(currentVideoLecture.end_at).format('YYYY년 MM월 DD일 HH시 mm분')}
                                                </div>
                                            </HtmlTooltip>
                                        </div>
                                        <div className="element">
                                            <div
                                                className={`icon-item live-counts${
                                                    currentVideoLecture.liveCounts < 1 ? ' no-participants' : ''
                                                }`}
                                            >
                                                {currentVideoLecture.liveCounts < 1 ? (
                                                    '참여 중인 인원 없음'
                                                ) : (
                                                    <>
                                                        <FiberManualRecordIcon fontSize="inherit" />
                                                        현재 {currentVideoLecture.liveCounts}명 참여 중
                                                    </>
                                                )}
                                            </div>
                                            <HtmlTooltip title="총 참여가능 인원 수">
                                                <div className="icon-item participants">
                                                    <GroupIcon fontSize="inherit" />
                                                    {currentVideoLecture.max_joins}명
                                                </div>
                                            </HtmlTooltip>
                                            {/* <HtmlTooltip title="시선추적 여부">
                                                <div className="icon-item eyetrack">
                                                    <FaceIcon fontSize="inherit" />
                                                    {currentVideoLecture.eyetrack ? '시선추적 있음' : '시선추적 없음'}
                                                </div>
                                            </HtmlTooltip> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="entrance-container">
                                    <EntranceButton
                                        disabled={new Date(currentVideoLecture.start_at).getTime() > serverdate.datetime}
                                        startIcon={<MeetingRoomIcon />}
                                        variant="text"
                                        onClick={enterVideoLecture}
                                    >
                                        입장
                                    </EntranceButton>
                                </div>
                            </EdPaper>
                        </div>
                    </div>
                ) : (
                    <OpenNewVidLec>
                        <h1>진행 중인 화상 강의가 없습니다.</h1>
                        {sessions.userType === 'students' ? null : (
                            <button onClick={handleNewVideoLectureDialogOpen}>
                                <p>강의 개설하기</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30.414" height="9.978" viewBox="0 0 30.414 9.978">
                                    <path
                                        id="icon"
                                        d="M0 0h28l-8.27 8.27"
                                        fill="none"
                                        stroke="#fff"
                                        strokeWidth="2px"
                                        transform="translate(0 1)"
                                    />
                                </svg>
                            </button>
                        )}
                    </OpenNewVidLec>
                )}
            </ClassWrapper>
        </>
    );
}

export default withRouter(VideoLecturesManage);
