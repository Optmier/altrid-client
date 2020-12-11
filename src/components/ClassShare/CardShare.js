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
import CardProblemPreview from '../TOFELRenderer/CardProblemPreview';
import * as $ from 'jquery';
import ClassDialogDelete from '../essentials/ClassDialogDelete';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import getAchieveValueForTypes from '../essentials/GetAchieveValueForTypes';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const InfoItems = ({ title, contents }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p" title={title}>
                {title}
            </div>
            <div className="card-content-p" title={contents}>
                {contents}
            </div>
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
                <>
                    <div className="card-content-p" style={{ marginRight: '0.4rem' }}>
                        {mm}분
                    </div>
                    <div className="card-content-p">{ss}초</div>
                </>
            )}
        </div>
    );
};
const DateItems = ({ title, start, end, userType, handleDateChange }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">
                {start} - {end}
            </div>
            <span style={{ marginRight: '6px' }}></span>
            <div className="date-item">{userType === 'students' ? null : <ModifyButton handleDateChange={handleDateChange} />}</div>
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
    /** Redux-state */
    const { data, loading, error } = useSelector((state) => state.assignmentActived.activedData);
    const sessions = useSelector((state) => state.RdxSessions);
    const serverdate = useSelector((state) => state.RdxServerDate);
    const dispatch = useDispatch();

    /** class-dialog 메소드 */
    // type 4가지 : date-init(과제 게시), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [testDialogopen, setTestDialogopen] = useState(false);
    const [deleteDialogopen, setDeleteDialogopen] = useState(false);

    const handleDialogOpen = (type) => {
        type === 'test' ? setTestDialogopen(true) : setDateDialogopen(true);
    };

    const handleDeleteDialogOpen = () => {
        setDeleteDialogopen(true);
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

        if (name === 'button-complete') {
            dispatch(patchActived(cardData['idx'], null));
            setTestDialogopen(false);
        } else if (name === 'button-restart') {
            if (data['due_date']) {
                dispatch(patchActived(cardData['idx'], data['due_date']));
            } else {
                alert('과제 기한 변경은 필수사항 입니다.');
            }
            setTestDialogopen(false);
        } else if (name === 'button-delete') {
            setTestDialogopen(false);
            handleDeleteDialogOpen();
        } else {
            //바깥 클릭했을때
            setTestDialogopen(false);
        }

        dispatch(changeDueDate(''));
    };

    //과제 기한 수정 클릭
    const handleDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'button-modify') {
            if (data['due_date']) {
                dispatch(patchActived(cardData['idx'], data['due_date']));
                setDateDialogopen(false);
            } else {
                alert('과제 기한 변경은 필수사항 입니다.');
            }
        } else {
            setDateDialogopen(false);
        }

        dispatch(changeDueDate(''));
    };
    /** =================== */

    /** toggle state */
    const [toggleState, setToggleState] = useState({
        checked:
            new Date(cardData['due_date']).getTime() >= serverdate.datetime &&
            new Date(cardData['created']).getTime() <= serverdate.datetime,
    });

    useEffect(() => {
        if (!serverdate.datetime) return;
        setToggleState({
            ...toggleState,
            checked:
                new Date(cardData['due_date']).getTime() >= serverdate.datetime &&
                new Date(cardData['created']).getTime() <= serverdate.datetime,
        });
    }, [cardData['due_date'], serverdate.datetime]);

    const [subTypeState, setSubTypeState] = useState('init');

    const handleToggleChange = (event) => {
        //setToggleState({ ...toggleState, [event.target.name]: event.target.checked });

        toggleState['checked'] ? setSubTypeState('init') : setSubTypeState('modify');
        handleDialogOpen('test');
    };
    /**===================== */

    /** 학생인 경우 과제 수행 */
    const onAssignmentCardItemClick = (idx, classNumber, assignmentTitle) => {
        const conf = window.confirm(
            '과제를 시작하시겠습니까?\n시작과 동시에 시도횟수가 증가하며, 끝낼 때는 반드시 종료 버튼을 눌러주세요!\n\n제한시간이 있는 과제는 중간에 종료하시면 재시도가 불가하오니 유의하시기 바랍니다.',
        );
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

    /** ProblemPreview 메소드 */
    const [openPreview, setOpenPreview] = useState(false);

    const handlePreviewOpen = () => {
        if (cardData['contents_data'].flatMap((m) => m.problemDatas).length === 0) {
            return alert('과제 수정을 통해 에디터에서 문항을 추가해주세요 !');
        }
        setOpenPreview(true);
    };

    const handlePreviewClose = () => {
        setOpenPreview(false);
    };

    const handlePreTest = (e) => {
        const $target = $(e.target);
        if (
            !(
                $target.parents('.card-option').length ||
                $target.attr('class') === 'card-option' ||
                $target.parents('.date-item').length ||
                $target.attr('class') === 'date-item' ||
                $target.parents('.goto-reports').length ||
                $target.attr('class') === 'goto-reports'
            )
        ) {
            if (new Date(cardData.created).getTime() > serverdate.datetime && sessions.userType === 'students') {
                alert('아직 시작되지 않은 과제입니다.');
                return;
            } else if (new Date(cardData.due_date).getTime() < serverdate.datetime && sessions.userType === 'students') {
                alert('기간이 지난 과제이므로 리포트 조회만 가능합니다.');
                return;
            } else if (tries && cardData.time_limit !== -2) {
                alert('시도횟수를 초과하셨습니다.\n문제가 발생한 경우는 선생님께 문의해 주세요!');
                return;
            }

            if (sessions.userType === 'students') {
                onAssignmentCardItemClick(testNum, match.params.num, cardData['title']);
            } else handlePreviewOpen();
        }
    };

    /** 유형별 분석 메소드 */
    const [assignmentTypeState, setAssignmentTypeState] = useState(0);

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
    }, []);

    return (
        <>
            <ClassDialog type="test" subType={subTypeState} open={testDialogopen} handleDialogClose={handleTestDialogClose} />
            <ClassDialog type="date" subType="modify" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />
            <ClassDialogDelete ver="assignment" open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />

            <CardProblemPreview
                openPreview={openPreview}
                metadata={cardData['contents_data'] ? cardData['contents_data'] : []}
                handlePreviewClose={handlePreviewClose}
                timeLimit={cardData['time_limit']}
            ></CardProblemPreview>

            <div className="class-card-root" onClick={handlePreTest}>
                <div
                    className={classNames(
                        { 'class-card-header': !toggleState['checked'] },
                        { 'class-card-header-on': toggleState['checked'] },
                        'class-card-wrapper',
                    )}
                >
                    <div className="card-title-p" title={cardData['title']}>
                        {cardData['title']}
                    </div>
                    <span className="card-option">
                        {sessions.userType === 'students' ? (
                            <>
                                {toggleState['checked'] ? (
                                    <span style={{ color: '#ffffff', fontSize: 14 }}>
                                        {cardData.time_limit === -2 && tries
                                            ? '제출됨, 재시도'
                                            : cardData.time_limit !== -2 && tries
                                            ? '제출됨'
                                            : '진행중'}
                                    </span>
                                ) : (
                                    <span style={{ color: '#989696', fontSize: 14 }}>
                                        {new Date(cardData.created).getTime() > serverdate.datetime ? '시작전' : '완료됨'}
                                    </span>
                                )}
                            </>
                        ) : null}
                        {sessions.userType === 'students' ? null : (
                            <ToggleSwitch
                                isStarted={new Date(cardData.created).getTime() <= serverdate.datetime}
                                toggle={toggleState['checked']}
                                handleToggleChange={handleToggleChange}
                                type="share"
                                name="checked"
                            />
                        )}
                    </span>
                </div>

                <div className="class-card-flex">
                    <div className="class-card-left">
                        <div className="class-card-contents class-card-wrapper">
                            <div className="contents-block">
                                <div className="card-item">
                                    <div className="card-subTitle-p" title={cardData['description']}>
                                        {cardData['description']}
                                    </div>
                                </div>
                            </div>

                            <div className="contents-block">
                                <InfoItems
                                    title={'문항수'}
                                    contents={cardData['contents_data'].flatMap((m) => m.problemDatas).length + '문제'}
                                />
                                <TimeItems title={'제한시간'} time_limit={cardData['time_limit']} />
                                {sessions.userType === 'students' ? (
                                    <TriesItems title={'시도횟수'} tries={!tries ? '없음' : tries} />
                                ) : null}
                                <DateItems
                                    title={'과제기한'}
                                    start={moment(cardData['created']).format('YY.MM.DD HH:mm')}
                                    end={moment(cardData['due_date']).format('YY.MM.DD HH:mm')}
                                    userType={sessions.userType}
                                    handleDateChange={handleDateChange}
                                />
                                <InfoItems
                                    title={'유형별 분석'}
                                    contents={
                                        assignmentTypeState < 100 ? (
                                            <HtmlTooltip2
                                                title={
                                                    <>
                                                        <ErrorOutlineIcon />
                                                        <p>유형별 분석의 최소 조건은 상단 뱃지를 클릭하여 확인해주세요!</p>
                                                    </>
                                                }
                                            >
                                                <p style={{ color: '#ff8383' }}>불가능</p>
                                            </HtmlTooltip2>
                                        ) : (
                                            '가능'
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="class-card-bottom-left">
                            <IsPresence type={'eye'} able={parseInt(cardData['eyetrack'])} align="left" />
                        </div>
                    </div>
                    <div className="class-card-right">
                        <div className="class-card-contents class-card-wrapper">
                            {sessions.userType === 'students' ? null : (
                                <>
                                    <StudentNum completeNum={pad(cardData['submitted_number'], 2)} totalNum={pad(totalStudents, 2)} />
                                    <div className="student-complete-text">제출한 학생</div>
                                </>
                            )}
                        </div>

                        <div className="class-card-bottom-right card-bottom-p">
                            {(sessions.userType === 'students' &&
                                tries &&
                                new Date(cardData['due_date']).getTime() < serverdate.datetime) ||
                            sessions.userType !== 'students' ? (
                                <Link
                                    className="goto-reports"
                                    to={
                                        sessions.userType === 'students'
                                            ? `${path}/${testNum}/details?user=${sessions.authId}`
                                            : `${path}/${testNum}`
                                    }
                                >
                                    <div className="share-report">
                                        {sessions.userType === 'students' ? '나의 리포트' : '과제별 리포트 보기'} <IoIosArrowForward />
                                    </div>
                                </Link>
                            ) : sessions.userType === 'students' && tries ? (
                                <span style={{ color: 'rgb(152, 150, 150)', fontSize: '0.75rem', minWidth: '9.1rem', textAlign: 'end' }}>
                                    기한 종료 후 리포트 활성화
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(CardShare);
