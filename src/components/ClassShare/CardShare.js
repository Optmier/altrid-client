import React, { useState, useEffect } from 'react';
import '../../styles/class_card.scss';
import IsPresence from '../essentials/IsPresence';
import { IoIosArrowForward } from 'react-icons/io';
import ModifyButton from '../essentials/ModifyButton';
import StudentNum from '../essentials/StudentNum';
import classNames from 'classnames';
import ToggleSwitch from '../essentials/ToggleSwitch';
import ClassDialog from '../essentials/ClassDialog';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { SecondtoMinute } from '../essentials/TimeChange';
import { useSelector, useDispatch } from 'react-redux';
import { patchActived, changeDueDate, deleteActived } from '../../redux_modules/assignmentActived';
import { getServerDate } from '../../redux_modules/serverdate';
import CardProblemPreview from '../TOFELRenderer/CardProblemPreview';
import * as $ from 'jquery';
import ClassDialogDelete from '../essentials/ClassDialogDelete';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import getAchieveValueForTypes from '../essentials/GetAchieveValueForTypes';
import Error from '../../pages/Error';
import TooltipCard from '../essentials/TooltipCard';
import CardPopOverShare from '../essentials/CardPopOverShare';
import StudentState from './StudentState';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const InfoItems = ({ title, contents }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <TooltipCard title={contents}>
                <div className="card-content-p">{contents}</div>
            </TooltipCard>
        </div>
    );
};
const TimeItems = ({ title, time_limit }) => {
    /** 제한시간 분할(분,초) 메소드 */
    let mm = SecondtoMinute(time_limit)[0];
    let ss = SecondtoMinute(time_limit)[1];

    return (
        <div className="card-item">
            <div className="card-content-title-p" title={title}>
                {title}
            </div>

            {time_limit === -2 ? (
                <div className="card-content-p">없음</div>
            ) : (
                <TooltipCard title={mm + '분 ' + ss + '초'}>
                    <div className="card-content-time">
                        <div className="card-content-p" style={{ marginRight: '0.4rem' }}>
                            {mm}분
                        </div>
                        <div className="card-content-p">{ss}초</div>
                    </div>
                </TooltipCard>
            )}
        </div>
    );
};
const DateItems = ({ title, start, end, userType, handleDateChange }) => {
    return (
        <div className="card-item" style={{ alignItems: 'flex-start' }}>
            <div className="card-content-title-p">{title}</div>
            <div className="date-content">
                <TooltipCard title={start + ' - ' + end}>
                    <div className="card-content-p date-content-p">
                        <span>{start} - </span>
                        <span>{end}</span>
                    </div>
                </TooltipCard>
                <div className="date-item">{userType === 'students' ? null : <ModifyButton handleDateChange={handleDateChange} />}</div>
            </div>
        </div>
    );
};
const TriesItems = ({ title, tries }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">{tries}</div>
        </div>
    );
};

const HtmlTooltip2 = withStyles((theme) => ({
    tooltip: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(253, 236, 234)',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        color: '#f44336',
        padding: '6px 16px',
        borderRadius: '4px',

        '& p': {
            margin: '0 0 0 1rem',
            color: 'rgb(97, 26, 21)',
            fontSize: '0.875rem',
            fontWeight: '400',
        },
    },
}))(Tooltip);

function CardShare({ testNum, cardData, tries, totalStudents, history, match }) {
    let path = history.location.pathname;
    const dispatch = useDispatch();

    /** Redux-state */
    const { data } = useSelector((state) => state.assignmentActived.dueData);
    const sessions = useSelector((state) => state.RdxSessions);
    const { datetime, loading, error } = useSelector((state) => state.RdxServerDate);

    /** component-state */
    const [subTypeState, setSubTypeState] = useState('init');
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [testDialogopen, setTestDialogopen] = useState(false);
    const [deleteDialogopen, setDeleteDialogopen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null); //옵션 버튼 state
    const [assignmentTypeState, setAssignmentTypeState] = useState(0); //유형별 분석 메소드
    const [toggleState, setToggleState] = useState({
        checked: new Date(cardData['due_date']).getTime() >= datetime && new Date(cardData['created']).getTime() <= datetime, // toggle state
    });
    const [openPreview, setOpenPreview] = useState(false); //ProblemPreview 메소드

    const handleDialogOpen = (type) => {
        type === 'test' ? setTestDialogopen(true) : setDateDialogopen(true);
    };
    const handleDeleteDialogOpen = () => {
        setDeleteDialogopen(true);
        handleOptionClose();
    };
    const handleDeleteDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'yes') {
            // console.log(cardData['idx']);
            dispatch(deleteActived(cardData['idx']));
            setDeleteDialogopen(false);
        } else {
            setDeleteDialogopen(false);
        }
    };
    /** toggle 버튼 메소드 */
    const handleTestDialogClose = (e) => {
        const { name } = e.target;

        //과제 재시작
        if (name === 'button-restart') {
            if (data) {
                //console.log(cardData['idx'], data);
                dispatch(patchActived(cardData['idx'], data));
            } else {
                alert('과제 기한 변경은 필수사항 입니다.');
            }
            setTestDialogopen(false);
            dispatch(changeDueDate(''));
        }
        //과제 완료하기
        else if (name === 'button-complete') {
            dispatch(patchActived(cardData['idx'], null));
            dispatch(getServerDate());

            setTestDialogopen(false);
        }
        //과제 완료 후, 삭제
        else if (name === 'button-delete') {
            setTestDialogopen(false);
            handleDeleteDialogOpen();
        }
        //x 또는 바깥 클릭했을때
        else {
            setTestDialogopen(false);
            dispatch(changeDueDate(''));
        }
    };
    /** 과제 기한 수정 클릭 */
    const handleDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'button-modify') {
            if (data) {
                dispatch(patchActived(cardData['idx'], data));
                setDateDialogopen(false);
            } else {
                alert('과제 기한 변경은 필수사항 입니다.');
            }
        } else {
            setDateDialogopen(false);
        }

        dispatch(changeDueDate(''));
    };
    const handleToggleChange = () => {
        //setToggleState({ ...toggleState, [event.target.name]: event.target.checked });

        toggleState['checked'] ? setSubTypeState('init') : setSubTypeState('modify');
        handleDialogOpen('test');
    };
    /** 학생인 경우 과제 수행 */
    const onAssignmentCardItemClick = (idx, classNumber, assignmentTitle) => {
        const conf = window.confirm('과제를 시작하시겠습니까?');
        if (!conf) return;
        if (window.mobile || (window.screen.width < 1440 && window.screen.height < 900)) {
            if (window.mobile) {
                alert('시선흐름 분석 서비스는\n테스크탑 브라우저에서만\n지원하고 있습니다.');
            } else {
                alert(
                    '시선흐름 분석 서비스를 위한 최소 해상도를 지켜주세요 :(\n최소 해상도 : 1440*900\n권장 해상도 : 1920*1080 (125% 이하)',
                );
            }
        } else {
            let screenWidth = window.screen.availWidth;
            let screenHeight = window.screen.availHeight;

            // 스크린 크기는 일단 고정해 놓음!
            screenWidth = 1280;
            screenHeight = 751;

            // let centerX = window.screen.width / 2 - screenWidth / 2;
            // let centerY = window.screen.height / 2 - (screenHeight * 2) / 3;

            /* const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
        const width = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
            ? document.documentElement.clientWidth
            : window.screen.width;
        const height = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : window.screen.height;
        const systemZoom = width / window.screen.availWidth;
        const centerX = (width - screenWidth) / 2 / systemZoom + dualScreenLeft;
        const centerY = (height - screenHeight) / 2 / systemZoom + dualScreenTop; */

            let centerX = (window.screen.width - screenWidth) / 2;
            let centerY = (window.screen.height - screenHeight) / 4;

            const open = window.open(
                `/assignments/do-it-now/${classNumber}/${idx}`,
                'Assignments',
                `height=${screenHeight}, width=${screenWidth}, left=${centerX}, top=${centerY}, toolbar=no, scrollbars=no, resizable=no, status=no`,
                true,
            );
            // open.addEventListener('load', windowOpened);
        }
    };
    /** modify state */
    const handleDateChange = () => {
        handleDialogOpen('date');
    };
    const handlePreviewOpen = () => {
        if (cardData['contents_data'].flatMap((m) => m.problemDatas).length === 0) {
            return alert('과제 수정을 통해 에디터에서 문항을 추가해주세요 !');
        }
        setOpenPreview(true);
    };
    const handlePreviewClose = () => {
        setOpenPreview(false);
    };
    const handleGoToReport = () => {
        handleOptionClose();

        if (sessions.userType === 'students') {
            history.push(`${path}/${testNum}/details?user=${sessions.authId}`);
        } else {
            if (!totalStudents) {
                alert('아직 클래스에 초대된 학생이 없습니다.\n학생들을 클래스에 초대 후, 이용 부탁드립니다.');
                return;
            } else if (!cardData['submitted_number']) {
                alert('아직 제출한 학생이 없습니다.');
                return;
            } else {
                history.push(`${path}/${testNum}`);
            }
        }
    };
    const handleCardClick = (e) => {
        if (e.target.id === 'modify') {
            return;
        }
        if (sessions.userType === 'teachers') {
            handleGoToReport();
            handleOptionClose();
        }
    };
    const handlePreTest = (e) => {
        const $target = $(e.target);

        if (!($target.parents('.card-option').length || $target.attr('class') === 'card-option')) {
            handlePreviewOpen();
        }
    };
    const handleStartTest = (e) => {
        onAssignmentCardItemClick(testNum, match.params.num, cardData['title']);
    };
    /** 옵션 버튼 메소드 */
    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleOptionClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!datetime) return;
        setToggleState({
            ...toggleState,
            checked: new Date(cardData['due_date']).getTime() >= datetime && new Date(cardData['created']).getTime() <= datetime,
        });
    }, [cardData['due_date'], datetime]);

    const _o = {};
    useEffect(() => {
        cardData['contents_data']
            .flatMap((m) => m.problemDatas)
            .forEach((d) => {
                const cat = d.category;
                !_o[cat] && (_o[cat] = {});
                !_o[cat].category && (_o[cat].category = 0);
                !_o[cat].count && (_o[cat].count = 0);
                _o[cat].category = cat;
                _o[cat].count += 1;
            });

        setAssignmentTypeState(
            getAchieveValueForTypes(
                Object.keys(_o).map((k) => _o[k]),
                3,
            ).value,
        );
        return () => {};
    }, [cardData['contents_data']]);

    if (loading === true && datetime === null)
        return <div style={{ backgroundColor: '#eeeeee', width: '100%', height: '100%', borderRadius: '10px' }}></div>;
    if (error) return <Error />;
    return (
        <>
            <ClassDialog type="test" subType={subTypeState} open={testDialogopen} handleDialogClose={handleTestDialogClose} />
            <ClassDialog type="date" subType="modify" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />
            <ClassDialogDelete ver="assignment" open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />
            <CardPopOverShare
                handleGoToReport={handleGoToReport}
                handlePreTest={handlePreTest}
                handleDeleteDialogOpen={handleDeleteDialogOpen}
                handleOptionClose={handleOptionClose}
                anchorEl={anchorEl}
            />
            <CardProblemPreview
                openPreview={openPreview}
                metadata={cardData['contents_data'] ? cardData['contents_data'] : []}
                handlePreviewClose={handlePreviewClose}
                timeLimit={cardData['time_limit']}
            />

            <div className="class-card-root">
                <div
                    className={classNames(
                        { 'class-card-header': !toggleState['checked'] },
                        { 'class-card-header-on': toggleState['checked'] },
                        'class-card-wrapper',
                    )}
                >
                    <TooltipCard title={cardData['title']}>
                        <div className="card-title-p" style={{ width: 'calc(100% - 150px)' }}>
                            {cardData['title']}
                        </div>
                    </TooltipCard>
                    <span className="card-option">
                        {sessions.userType === 'students' ? (
                            <>
                                <span style={{ color: 'white', fontSize: 14 }}>
                                    {new Date(cardData.due_date).getTime() > datetime ? '과제 진행중' : '과제 완료됨'}
                                </span>
                            </>
                        ) : (
                            <div className="card-option-teacher">
                                <ToggleSwitch
                                    isStarted={new Date(cardData.created).getTime() <= datetime}
                                    toggle={toggleState['checked']}
                                    handleToggleChange={handleToggleChange}
                                    type="share"
                                    name="checked"
                                />

                                <svg
                                    onClick={handleOptionClick}
                                    width="19"
                                    height="5"
                                    viewBox="0 0 19 5"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="2.5" cy="2.5" r="2.5" fill="white" />
                                    <circle cx="16.5" cy="2.5" r="2.5" fill="white" />
                                    <circle cx="9.5" cy="2.5" r="2.5" fill="white" />
                                </svg>
                            </div>
                        )}
                    </span>
                </div>

                <div className="class-card-flex class-card-wrapper" onClick={handleCardClick}>
                    <div className="class-card-top">
                        <div className="class-card-left">
                            <div className="class-card-contents ">
                                <div className="contents-block">
                                    <div className="card-item">
                                        <TooltipCard title={cardData['description']}>
                                            <div className="card-subTitle-p">{cardData['description']}</div>
                                        </TooltipCard>
                                    </div>
                                </div>

                                <div className="contents-block">
                                    <InfoItems
                                        title={'문항수'}
                                        contents={cardData['contents_data'].flatMap((m) => m.problemDatas).length + '문제'}
                                    />
                                    <TimeItems title={'제한시간'} time_limit={cardData['time_limit']} />
                                    <DateItems
                                        title={'과제기한'}
                                        start={moment(cardData['created']).format('MM.DD HH:mm')}
                                        end={moment(cardData['due_date']).format('MM.DD HH:mm')}
                                        userType={sessions.userType}
                                        handleDateChange={handleDateChange}
                                    />
                                    {sessions.userType === 'students' ? (
                                        <div className="mobile-test-state">
                                            <StudentState
                                                assignmentState={new Date(cardData.due_date).getTime() > datetime ? true : false}
                                                state={
                                                    cardData.time_limit === -2 && tries
                                                        ? 'ing'
                                                        : cardData.time_limit !== -2 && tries
                                                        ? 'done'
                                                        : 'pre'
                                                }
                                                handlePreTest={handlePreTest}
                                                handleStartTest={handleStartTest}
                                                handleGoToReport={handleGoToReport}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mobile-student-num">
                                            <div className="title">제출한 학생</div>
                                            <div className="contents">
                                                {pad(cardData['submitted_number'], 2)} / {pad(totalStudents, 2)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="class-card-right">
                            <div className="class-card-contents">
                                {sessions.userType === 'students' ? (
                                    <StudentState
                                        assignmentState={new Date(cardData.due_date).getTime() > datetime ? true : false}
                                        state={
                                            cardData.time_limit === -2 && tries
                                                ? 'ing'
                                                : cardData.time_limit !== -2 && tries
                                                ? 'done'
                                                : 'pre'
                                        }
                                        handlePreTest={handlePreTest}
                                        handleStartTest={handleStartTest}
                                        handleGoToReport={handleGoToReport}
                                    />
                                ) : (
                                    <>
                                        <StudentNum completeNum={pad(cardData['submitted_number'], 2)} totalNum={pad(totalStudents, 2)} />
                                        <div className="student-complete-text">제출한 학생</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="class-card-bottom">
                        {sessions.userType === 'students' ? null : (
                            <IsPresence type={'analysis'} able={assignmentTypeState} align="left" fontSize="0.85rem" />
                        )}
                        <IsPresence type={'eye'} able={parseInt(cardData['eyetrack'])} align="left" fontSize="0.85rem" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(CardShare);
