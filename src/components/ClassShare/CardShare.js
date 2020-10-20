import React, { useState } from 'react';
import '../../styles/class_card.scss';
import CardContentBottom from '../essentials/CardContentBottom';
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
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">{contents}</div>
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

function CardShare({ classNum, dummy, history, match }) {
    let path = history.location.pathname;

    /** class-modal 메소드 */
    // type 4가지 : date-init(과제 공유), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateModalopen, setDateModalOpen] = useState(false);
    const [testModalopen, setTestModalOpen] = useState(false);

    const handleDialogOpen = (type) => {
        type === 'test' ? setTestModalOpen(true) : setDateModalOpen(true);
    };

    const handleTestDialogClose = () => {
        setTestModalOpen(false);
    };
    const handleDateDialogClose = () => {
        setDateModalOpen(false);
    };
    /** =================== */

    /** toggle state */
    const [toggleState, setToggleState] = useState({
        checked: dummy['progress'],
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
            <ClassDialog type="test" subType={subTypeState} open={testModalopen} handleDialogClose={handleTestDialogClose} />
            <ClassDialog type="date" subType="modify" open={dateModalopen} handleDialogClose={handleDateDialogClose} />

            <div className="class-card-root">
                <div
                    className={classNames(
                        { 'class-card-header': !toggleState['checked'] },
                        { 'class-card-header-on': toggleState['checked'] },
                        'class-card-wrapper',
                    )}
                >
                    <div className="card-title-p">{dummy['title']}</div>
                    <span className="card-option">
                        <ToggleSwitch toggle={toggleState['checked']} handleToggleChange={handleToggleChange} type="share" name="checked" />
                    </span>
                </div>

                <div></div>

                <div className="class-card-flex">
                    <div className="class-card-left">
                        <div className="class-card-contents class-card-wrapper">
                            <div className="contents-block">
                                <div className="card-item card-subTitle-p">과제 한줄 설명 과제 한줄 설명 과제 한줄 설명 과제 한줄 설명</div>
                                <div className="card-item card-content-p">에듀이티 고2</div>
                            </div>

                            <div className="contents-block">
                                <InfoItems title={'문항수'} contents={'3set / 15문제'} />
                                <InfoItems title={'제한시간'} contents={'14분'} />
                                <DateItems title={'최종수정'} start={'09/10/2020'} end={'09/30/2020'} handleDateChange={handleDateChange} />
                            </div>
                        </div>
                        <div className="class-card-bottom-left">
                            <CardContentBottom type={'eye'} able={true} align="left" />
                        </div>
                    </div>
                    <div className="class-card-right">
                        <div className="class-card-contents class-card-wrapper">
                            <StudentNum completeNum={14} totalNum={30} />
                            <div className="student-complete-text">제출한 학생</div>
                        </div>

                        <div className="class-card-bottom-right card-bottom-p">
                            <Link to={`${path}/${classNum}`}>
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
