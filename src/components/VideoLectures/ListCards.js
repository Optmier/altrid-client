import React, { useState } from 'react';
import DateRangeIcon from '@material-ui/icons/DateRange';
import GroupIcon from '@material-ui/icons/Group';
import TimerIcon from '@material-ui/icons/Timer';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { Checkbox, withStyles } from '@material-ui/core';
import EditorProblemCheckboxUnchecked from '../TOFELEditor/assets/EditorProblemCheckboxUnchecked';
import EditorProblemCheckboxChecked from '../TOFELEditor/assets/EditorProblemCheckboxChecked';
import ErrorIcon from '@material-ui/icons/Error';

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

const CardRoot = styled.div`
    display: flex;
    background-color: #ffffff;
    border-radius: 11px;
    padding: 18px;

    &.no-lectures {
        align-items: center;
        color: #605f5f;
        display: flex;
        justify-content: center;
        font-size: 1.25rem;
        min-height: 170px;
        padding: 0;

        & svg.MuiSvgIcon-root {
            margin-top: 2px;
            margin-right: 8px;
        }
    }

    & + & {
        margin-top: 18px;
    }

    @media (min-width: 768px) and (max-width: 1231px) {
        padding: 16px;
    }

    @media (min-width: 0) and (max-width: 767px) {
        flex-direction: column;
        padding: 16px;

        &.no-lectures {
            flex-direction: row;
        }
    }
`;

const CardLeft = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px;
    width: 55%;

    &.scheduled {
        width: 50%;
    }

    & header {
        display: inherit;
        flex-direction: column;

        & div.upper {
            align-items: center;
            display: inherit;

            & h2.title {
                color: #171717;
                font-size: 1.25rem;
                font-weight: 600;
            }

            & div.eyetrack-indicator {
                align-items: center;
                display: inherit;
                margin-left: 40px;

                & p {
                    color: #666666;
                    font-size: 0.625rem;
                    font-weight: 400;
                    margin-right: 8px;
                }
            }
        }

        & p.desc {
            color: #5c5c5c;
            font-weight: 500;
            margin-top: 6px;
        }
    }

    & .date-container {
        margin-top: 45px;

        & .date-range {
            align-items: center;
            color: #666666;
            display: flex;
            font-size: 0.875rem;

            & p.t {
                font-size: inherit;
                font-weight: 600;
                margin-left: 12px;
                min-width: 3.6rem;
            }

            & p.date {
                font-size: inherit;
                font-weight: 500;
                margin-left: 8%;
            }

            & .live-streaming-mark {
                margin-left: 20px;
            }
        }
    }

    @media (min-width: 768px) and (max-width: 1231px) {
        padding: 4px;
        padding-right: 12px;
        width: 52%;

        &.scheduled {
            width: 50%;
        }

        & .date-container {
            & .date-range {
                & p.t {
                    margin-left: 8px;
                }

                & p.date {
                    margin-left: 15px;
                }

                & .live-streaming-mark {
                    margin-left: 8px;
                }
            }
        }
    }

    @media (min-width: 0) and (max-width: 767px) {
        width: initial;
        &.scheduled {
            width: initial;
        }
        & .date-container {
            margin-top: 16px;
        }
    }
`;

const CardRight = styled.div`
    align-items: center;
    border-left: 2px solid rgba(112, 112, 112, 0.3);
    display: flex;
    padding: 8px;
    width: 45%;

    &.scheduled {
        width: 50%;
    }

    & div.participants-container {
        display: flex;
        flex-direction: column;
        text-align: center;
        margin-left: 4%;
        width: 100%;

        &.scheduled {
            margin-left: 0;
        }

        & p.tag {
            color: #666666;
            font-size: 0.875rem;
            font-weight: 600;
        }
        & div.numbers {
            font-size: 2.75rem;
            font-weight: 500;
            color: #666666;
        }
    }

    & div.participants-container-mobile {
        display: none;
        width: 100%;

        & .container {
            align-items: center;
            color: #666666;
            display: flex;
            font-size: 0.875rem;
            width: 100%;

            & p.tag {
                font-size: inherit;
                font-weight: 600;
                margin-left: 12px;
                min-width: 6rem;
            }

            & p.numbers {
                font-size: 1.25rem;
                font-weight: 500;
                margin-left: 8%;
            }
        }
    }

    & div.buttons-container {
        & button + button {
            margin-top: 10px;
        }
    }

    @media (min-width: 768px) and (max-width: 1231px) {
        padding: 4px;
        width: 48%;

        &.scheduled {
            width: 50%;
        }

        & div.participants-container {
            margin-left: 0;
            margin-right: 4%;

            &.scheduled {
                margin-left: 0;
                margin-right: 0;
            }

            & div.numbers {
                font-size: 2rem;
            }
        }
    }

    @media (min-width: 0) and (max-width: 767px) {
        border: none;
        flex-direction: column;
        width: initial;

        &.scheduled {
            width: initial;
        }

        & div.participants-container {
            display: none;
        }

        & div.participants-container-mobile {
            display: flex;
        }

        & div.buttons-container {
            display: flex;
            margin-top: 18px;
            width: 100%;

            & button + button {
                margin-top: initial;
                margin-left: 10px;
            }
        }
    }
`;

const Circle = styled.div`
    background-color: #6f7070;
    border-radius: 50%;
    min-width: 10px;
    min-height: 10px;
    width: 10px;
    height: 10px;

    &.red {
        background-color: #ff4f4e;
    }
`;

const CurrentVideoLectureCard = React.memo(function ({
    number,
    title,
    description,
    hasEyetrack,
    startDate,
    endDate,
    totalParticipants,
    currentParticipants,
    userType,
    serverDate,
    onEntranceClick,
    onLectureCloseClick,
}) {
    return (
        <CardRoot>
            <CardLeft>
                <header>
                    <div className="upper">
                        <h2 className="title">{title}</h2>
                        <div className="eyetrack-indicator">
                            <p>{hasEyetrack ? '시선추적 포함' : '시선추적 미포함'}</p>
                            <Circle className={hasEyetrack ? 'red' : ''} />
                        </div>
                    </div>
                    <p className="desc">{description}</p>
                </header>
                <div className="date-container">
                    <div className="date-range">
                        <DateRangeIcon fontSize="small" />
                        <p className="t">강의 시간</p>
                        <p className="date">
                            {moment(startDate).format('YY년 M월 D일 H:mm')} - {moment(endDate).format('YY년 M월 D일 H:mm')}
                        </p>
                        <div className="live-streaming-mark">LIVE</div>
                    </div>
                </div>
            </CardLeft>
            <CardRight>
                <div className="participants-container">
                    <p className="tag">참여 중인 인원</p>
                    <div className="numbers">
                        {currentParticipants} / {totalParticipants}
                    </div>
                </div>
                <div className="participants-container-mobile">
                    <div className="container">
                        <GroupIcon fontSize="small" />
                        <p className="tag">참여 중인 인원</p>
                        <p className="numbers">
                            {currentParticipants} / {totalParticipants}
                        </p>
                    </div>
                </div>
                <div className="buttons-container">
                    <StyledButton className="video-lecture main" onClick={onEntranceClick}>
                        입장하기
                    </StyledButton>
                    {userType === 'students' ? null : (
                        <StyledButton className="video-lecture" onClick={onLectureCloseClick}>
                            종료하기
                        </StyledButton>
                    )}
                </div>
            </CardRight>
        </CardRoot>
    );
});

CurrentVideoLectureCard.defaultProps = {
    number: 0,
    title: '강의 제목 입니다.',
    description: '강의 설명 입니다.',
    hasEyetrack: true,
    startDate: new Date(),
    endDate: new Date(),
    totalParticipants: 99,
    currentParticipants: 45,
    userType: 'teachers',
    serverDate: new Date(),
    onEntranceClick() {
        console.log('강의에 입장합니다!');
    },
    onLectureCloseClick() {
        console.log('강의를 폐쇄합니다.');
    },
};

const CkbxCtrl = styled.div`
    display: flex;

    & .card-checkbox {
        margin-right: 16px;
    }

    & .card-root {
        width: 100%;
        & .card-checkbox {
            display: none;
        }
    }

    & + & {
        margin-top: 18px;
    }

    @media (min-width: 0) and (max-width: 767px) {
        & .card-checkbox {
            display: none;
        }
        & .card-root {
            width: 100%;

            & .card-checkbox {
                padding-top: 12px;
                margin-right: 6px;
                display: initial;
            }
        }
    }
`;

const CkbxCardWrapper = styled.div`
    display: inherit;
    width: 100%;

    & .card-contents {
        display: inherit;
        width: 100%;
    }

    @media (min-width: 0) and (max-width: 767px) {
        & .card-contents {
            flex-direction: column;
        }
    }
`;

const EdCheckbox = withStyles((theme) => ({
    root: {
        padding: 0,
        '&:hover': {
            backgroundColor: '#ffffff00',
        },
    },
}))(Checkbox);

const ScheduledVideoLectureCard = React.memo(function ({
    number,
    title,
    description,
    hasEyetrack,
    startDate,
    endDate,
    userType,
    serverDate,
    onCheckboxChanged,
}) {
    const t1 = moment(new Date(serverDate));
    const t2 = moment(startDate);
    const daysDiff = moment.duration(t2.diff(t1)).days();
    const hoursDiff = moment.duration(t2.diff(t1)).hours();
    const minutesDiff = moment.duration(t2.diff(t1)).days();
    const [cardChecked, setCardChecked] = useState(false);
    const handleChangeCheckbox = ({ target }) => {
        const { checked } = target;
        setCardChecked(checked);
        onCheckboxChanged(number, checked);
    };
    return (
        <CkbxCtrl>
            {userType === 'students' ? null : (
                <EdCheckbox
                    className="card-checkbox"
                    icon={<EditorProblemCheckboxUnchecked />}
                    checkedIcon={<EditorProblemCheckboxChecked />}
                    disableRipple
                    size="medium"
                    color="default"
                    onChange={handleChangeCheckbox}
                />
            )}
            <CardRoot className="card-root">
                <CkbxCardWrapper>
                    {userType === 'students' ? null : (
                        <EdCheckbox
                            className="card-checkbox"
                            icon={<EditorProblemCheckboxUnchecked />}
                            checkedIcon={<EditorProblemCheckboxChecked />}
                            disableRipple
                            size="medium"
                            color="default"
                            onChange={handleChangeCheckbox}
                        />
                    )}
                    <div className="card-contents">
                        <CardLeft className="scheduled">
                            <header>
                                <div className="upper">
                                    <h2 className="title">{title}</h2>
                                    <div className="eyetrack-indicator">
                                        <p>{hasEyetrack ? '시선추적 포함' : '시선추적 미포함'}</p>
                                        <Circle className={hasEyetrack ? 'red' : ''} />
                                    </div>
                                </div>
                                <p className="desc">{description}</p>
                            </header>
                            <div className="date-container">
                                <div className="date-range">
                                    <DateRangeIcon fontSize="small" />
                                    <p className="t">강의 시간</p>
                                    <p className="date">
                                        {moment(startDate).format('YY년 M월 D일 H:mm')} - {moment(endDate).format('YY년 M월 D일 H:mm')}
                                    </p>
                                </div>
                            </div>
                        </CardLeft>
                        <CardRight className="scheduled">
                            <div className="participants-container scheduled">
                                <p className="tag">남은 시간</p>
                                <div className="numbers">
                                    {`${daysDiff < 1 ? '' : '일'} ${hoursDiff < 1 ? '' : '시간'} ${minutesDiff}분`}
                                </div>
                            </div>
                            <div className="participants-container-mobile">
                                <div className="container">
                                    <TimerIcon fontSize="small" />
                                    <p className="tag">남은 시간</p>
                                    <p className="numbers">
                                        {`${daysDiff < 1 ? '' : '일'} ${hoursDiff < 1 ? '' : '시간'} ${minutesDiff}분`}
                                    </p>
                                </div>
                            </div>
                        </CardRight>
                    </div>
                </CkbxCardWrapper>
            </CardRoot>
        </CkbxCtrl>
    );
});

ScheduledVideoLectureCard.defaultProps = {
    number: 0,
    title: '강의 제목 입니다.',
    description: '강의 설명 입니다.',
    hasEyetrack: true,
    startDate: new Date(),
    endDate: new Date(),
    userType: 'teachers',
    serverDate: new Date(),
    onCheckboxChanged(target, checked) {
        console.log(target, checked);
    },
};

const LogsWrapper = styled.div``;

const LogsCardRoot = styled.div`
    background-color: #ffffff;
    border-radius: 11px;
    padding: 18px;

    & div.contents {
        display: flex;
    }

    @media (min-width: 0) and (max-width: 767px) {
        & div.contents {
            flex-direction: column;
        }
    }
`;

const LogsCardLeft = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    padding-right: 8px;

    & div.title {
        display: flex;

        & h2 {
            color: #171717;
            font-size: 1.25rem;
        }

        & div.eyetrack-indicator {
            align-items: center;
            display: inherit;
            margin-left: 40px;

            & p {
                color: #666666;
                font-size: 0.625rem;
                font-weight: 400;
                margin-right: 8px;
                min-width: 4.3rem;
            }
        }
    }

    & div.desc {
        margin-top: 6px;

        & p {
            color: #5c5c5c;
        }
    }

    @media (min-width: 768px) and (max-width: 1231px) {
        & div.title {
            & div.eyetrack-indicator {
                margin-left: 20px;
            }
        }
    }

    @media (min-width: 0) and (max-width: 767px) {
        padding: 0;
        width: initial;

        & div.title {
            & div.eyetrack-indicator {
                margin-left: 32px;
            }
        }
    }
`;

const LogsCardRight = styled.div`
    border-left: 2px solid rgba(112, 112, 112, 0.3);
    align-items: center;
    display: flex;
    justify-content: center;
    width: 50%;
    padding-left: 8px;

    & div.date {
        color: rgba(23, 23, 23, 0.7);
        display: flex;
        justify-content: center;
        width: 100%;

        & p.t {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 0 4%;
            min-width: 3.6rem;
        }

        & p.date {
            font-size: 0.875rem;
            font-weight: 500;
        }
    }

    @media (min-width: 0) and (max-width: 767px) {
        border-left: none;
        padding: 0;
        margin-top: 18px;
        width: initial;

        & div.date {
            justify-content: initial;
        }
    }
`;

const LogsVideoLectureCard = React.memo(function LogsVideoLectureCard({
    number,
    title,
    description,
    hasEyetrack,
    startDate,
    endDate,
    onReportClick,
}) {
    return (
        <LogsWrapper>
            <LogsCardRoot>
                <div className="contents">
                    <LogsCardLeft>
                        <div className="title">
                            <h2>{title}</h2>
                            <div className="eyetrack-indicator">
                                <p>{hasEyetrack ? '시선추적 포함' : '시선추적 미포함'}</p>
                                <Circle className={hasEyetrack ? 'red' : ''} />
                            </div>
                        </div>
                        <div className="desc">
                            <p>{description}</p>
                        </div>
                    </LogsCardLeft>
                    <LogsCardRight>
                        <div className="date">
                            <DateRangeIcon fontSize="small" />
                            <p className="t">강의 시간</p>
                            <p className="date">
                                {moment(startDate).format('YY년 M월 D일 H:mm')} - {moment(endDate).format('YY년 M월 D일 H:mm')}
                            </p>
                        </div>
                        <div className="report-button">
                            {/* <StyledButton className={hasEyetrack ? 'video-lecture main' : 'video-lecture'}>리포트 확인하기</StyledButton> */}
                        </div>
                    </LogsCardRight>
                </div>
            </LogsCardRoot>
        </LogsWrapper>
    );
});
LogsVideoLectureCard.defaultProps = {
    number: 0,
    title: '이전 강의 제목입니다',
    description: '이전 강의 설명입니다.',
    hasEyetrack: false,
};

const NoLecturesCard = ({ message }) => (
    <CardRoot className="no-lectures">
        <ErrorIcon fontSize="small" />
        {message}
    </CardRoot>
);
NoLecturesCard.defaultProps = {
    message: '현재 진행 중인 화상 강의가 없습니다.',
};

export { CurrentVideoLectureCard, ScheduledVideoLectureCard, LogsVideoLectureCard, NoLecturesCard };
