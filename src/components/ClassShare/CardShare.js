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
import { patchActived, changeDueDate } from '../../redux_modules/assignmentActived';
import CardProblemPreview from '../TOFELRenderer/CardProblemPreview';
import * as $ from 'jquery';

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
const TimeItems = ({ title, mm, ss }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p" title={title}>
                {title}
            </div>

            {mm === -2 ? (
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

function CardShare({ testNum, cardData, history }) {
    let path = history.location.pathname;

    /** Redux-state */
    const { data, loading, error } = useSelector((state) => state.assignmentActived.activedData);
    const sessions = useSelector((state) => state.RdxSessions);
    const dispatch = useDispatch();

    /** class-dialog 메소드 */
    // type 4가지 : date-init(과제 게시), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [testDialogopen, setTestDialogopen] = useState(false);

    /** 제한시간 분할(분,초) 메소드 */
    let mm = SecondtoMinute(cardData['time_limit'])[0];
    let ss = SecondtoMinute(cardData['time_limit'])[1];

    /** dialog 메소드 */
    const handleDialogOpen = (type) => {
        type === 'test' ? setTestDialogopen(true) : setDateDialogopen(true);
    };

    //과제 toggle 클릭
    const handleTestDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'button-complete') {
            dispatch(patchActived(cardData['idx'], null));
        } else if (name === 'button-restart') {
            if (data['due_date']) {
                dispatch(patchActived(cardData['idx'], data['due_date']));
            } else {
                alert('과제 기한 변경은 필수항목입니다.');
            }
        }
        setTestDialogopen(false);
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
                alert('과제 기한 변경은 필수항목입니다.');
            }
        } else {
            setDateDialogopen(false);
        }

        dispatch(changeDueDate(''));
    };
    /** =================== */

    /** toggle state */
    const [toggleState, setToggleState] = useState({
        checked: moment(cardData['due_date']).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss'),
    });

    useEffect(() => {
        setToggleState({
            ...toggleState,
            checked: moment(cardData['due_date']).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss'),
        });
    }, [cardData['due_date']]);

    const [subTypeState, setSubTypeState] = useState('init');

    const handleToggleChange = (event) => {
        //setToggleState({ ...toggleState, [event.target.name]: event.target.checked });

        toggleState['checked'] ? setSubTypeState('init') : setSubTypeState('modify');
        handleDialogOpen('test');
    };
    /**===================== */

    /** modify state */
    const handleDateChange = () => {
        handleDialogOpen('date');
    };

    /** ProblemPreview 메소드 */
    const [openPreview, setOpenPreview] = useState(false);

    const handlePreviewOpen = () => {
        if (cardData['contents_data'].flatMap((m) => m.problemDatas).length === 0) {
            return alert('아직 문제를 추가하지 않으셨습니다 :(');
        }
        setOpenPreview(true);
    };

    const handlePreviewClose = () => {
        setOpenPreview(false);
    };

    const handlePreTest = (e) => {
        const $target = $(e.target);
        console.log($target);
        if (
            !(
                $target.parents('.card-option').length ||
                $target.attr('class') === 'card-option' ||
                $target.parents('.date-item').length ||
                $target.attr('class') === 'date-item'
            )
        ) {
            handlePreviewOpen();
        }
    };

    return (
        <>
            <ClassDialog type="test" subType={subTypeState} open={testDialogopen} handleDialogClose={handleTestDialogClose} />
            <ClassDialog type="date" subType="modify" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />

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
                                    <span style={{ color: '#ffffff', fontSize: 14 }}>진행중</span>
                                ) : (
                                    <span style={{ color: '#989696', fontSize: 14 }}>완료됨</span>
                                )}
                            </>
                        ) : null}
                        {sessions.userType === 'students' ? null : (
                            <ToggleSwitch
                                toggle={toggleState['checked']}
                                handleToggleChange={handleToggleChange}
                                type="share"
                                name="checked"
                            />
                        )}
                    </span>
                </div>

                <div></div>

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
                                <TimeItems title={'제한시간'} mm={mm} ss={ss} />
                                <DateItems
                                    title={'과제기한'}
                                    start={moment(cardData['created']).format('YY.MM.DD HH:mm')}
                                    end={moment(cardData['due_date']).format('YY.MM.DD HH:mm')}
                                    userType={sessions.userType}
                                    handleDateChange={handleDateChange}
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
                                    <StudentNum completeNum={'00'} totalNum={'00'} />
                                    <div className="student-complete-text">제출한 학생</div>
                                </>
                            )}
                        </div>

                        <div className="class-card-bottom-right card-bottom-p">
                            <Link
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(CardShare);
