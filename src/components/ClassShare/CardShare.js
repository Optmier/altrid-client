import React, { useState } from 'react';
import '../../styles/class_card.scss';
import IsPresence from '../essentials/IsPresence';
import { IoIosArrowForward } from 'react-icons/io';
import ModifyButton from '../essentials/ModifyButton';
import StudentNum from '../essentials/StudentNum';
import classNames from 'classnames';
import ToggleSwitch from '../essentials/ToggleSwitch';
import ClassDialog from '../essentials/ClassDialog';
import { Link, withRouter } from 'react-router-dom';

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
const DateItems = ({ title, start, end, handleDateChange }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">
                {start} - {end}
            </div>
            <span style={{ marginRight: '6px' }}></span>
            <ModifyButton handleDateChange={handleDateChange} />
        </div>
    );
};

function CardShare({ testNum, cardData, history }) {
    let path = history.location.pathname;
    // let { id } = match.params;
    // console.log(id);

    /** class-dialog 메소드 */
    // type 4가지 : date-init(과제 게시), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [testDialogopen, setTestDialogopen] = useState(false);

    const handleDialogOpen = (type) => {
        type === 'test' ? setTestDialogopen(true) : setDateDialogopen(true);
    };

    const handleTestDialogClose = () => {
        setTestDialogopen(false);
    };
    const handleDateDialogClose = () => {
        setDateDialogopen(false);
    };
    /** =================== */

    /** toggle state */
    const [toggleState, setToggleState] = useState({
        checked: cardData['progress'],
    });
    const [subTypeState, setSubTypeState] = useState('init');

    const handleToggleChange = (event) => {
        setToggleState({ ...toggleState, [event.target.name]: event.target.checked });

        toggleState['checked'] ? setSubTypeState('init') : setSubTypeState('modify');
        handleDialogOpen('test');
    };
    /**===================== */

    /** modify state */
    const handleDateChange = () => {
        handleDialogOpen('date');
    };
    /** */
    return (
        <>
            <ClassDialog type="test" subType={subTypeState} open={testDialogopen} handleDialogClose={handleTestDialogClose} />
            <ClassDialog type="date" subType="modify" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />

            <div className="class-card-root">
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
                        <ToggleSwitch toggle={toggleState['checked']} handleToggleChange={handleToggleChange} type="share" name="checked" />
                    </span>
                </div>

                <div></div>

                <div className="class-card-flex">
                    <div className="class-card-left">
                        <div className="class-card-contents class-card-wrapper">
                            <div className="contents-block">
                                <div className="card-item">
                                    <div className="card-subTitle-p" title={cardData['desc']}>
                                        {cardData['desc']}
                                    </div>
                                </div>

                                <div className="card-item">
                                    <div className="card-content-p" title={cardData['age']}>
                                        {cardData['age']}
                                    </div>
                                </div>
                            </div>

                            <div className="contents-block">
                                <InfoItems title={'문항수'} contents={cardData['question_num']} />
                                <InfoItems title={'제한시간'} contents={cardData['time']} />
                                <DateItems
                                    title={'과제기한'}
                                    start={cardData['start']}
                                    end={cardData['end']}
                                    handleDateChange={handleDateChange}
                                />
                            </div>
                        </div>
                        <div className="class-card-bottom-left">
                            <IsPresence type={'eye'} able={cardData['eyetrack']} align="left" />
                        </div>
                    </div>
                    <div className="class-card-right">
                        <div className="class-card-contents class-card-wrapper">
                            <StudentNum completeNum={cardData['complete_student']} totalNum={cardData['total_student']} />
                            <div className="student-complete-text">제출한 학생</div>
                        </div>

                        <div className="class-card-bottom-right card-bottom-p">
                            <Link to={`${path}/${testNum}`}>
                                <div className="share-report">
                                    과제별 리포트 보기 <IoIosArrowForward />
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
