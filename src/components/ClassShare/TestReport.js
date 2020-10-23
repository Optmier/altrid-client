import React, { useState } from 'react';
import '../../styles/test_report.scss';
import shareDummy from '../../datas/shareDummy.json';
import BranchNav from '../essentials/BranchNav';
import ClassWrapper from '../essentials/ClassWrapper';
import IsPresence from '../essentials/IsPresence';
import ToggleSwitch from '../essentials/ToggleSwitch';
import ClassDialog from '../essentials/ClassDialog';
import ModifyButton from '../essentials/ModifyButton';
import StudentNum from '../essentials/StudentNum';

function TestReport({ match }) {
    let { classNum } = match.params;

    /** class-modal 메소드 */
    // type 4가지 : date-init(과제 공유), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [testDialogopen, setTestDialogopen] = useState(false);

    const handleDialogOpen = () => {
        setTestDialogopen(true);
    };

    const handleTestDialogClose = () => {
        setTestDialogopen(false);
    };

    /** =================== */

    /** toggle state */
    const [toggleState, setToggleState] = useState({
        checked: shareDummy['progress'],
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

            <ClassWrapper>
                <div className="class-report-root">
                    <BranchNav deps="2" />

                    <div className="class-report-info">
                        <div className="report-box">
                            <div className="report-col">
                                <h3>{shareDummy[classNum]['title']}</h3>
                            </div>
                            <div className="report-col">
                                <p>{shareDummy[classNum]['desc']}</p>
                            </div>
                            <div className="report-col">
                                <div className="left-bottom">
                                    <IsPresence type="eye" able={shareDummy[classNum]['eyetrack']} align="right" />
                                    <ToggleSwitch />
                                </div>
                            </div>
                        </div>
                        <div className="report-box">
                            <div className="report-col">
                                <div className="mid-mid">
                                    <span className="mid-desc">문항수</span>
                                    <span className="mid-content">{shareDummy[classNum]['question_num']}</span>
                                </div>
                            </div>

                            <div className="report-col">
                                <div className="mid-mid">
                                    <span className="mid-desc">제한 시간</span>
                                    <span className="mid-content">{shareDummy[classNum]['time']}</span>
                                </div>
                            </div>
                            <div className="report-col">
                                <div className="mid-mid">
                                    <span className="mid-desc">과제 기한</span>
                                    <span className="mid-content">
                                        {shareDummy[classNum]['start']} ~ {shareDummy[classNum]['start']}
                                    </span>
                                    <ModifyButton handleDateChange={handleDateChange} />
                                </div>
                            </div>
                        </div>
                        <div className="report-box">
                            <div className="report-col">
                                <div className="right-top">
                                    <StudentNum completeNum={14} totalNum={30} width="75%" />
                                </div>
                            </div>
                            <div className="report-col">
                                <div className="right-bottom">제출한 학생</div>
                            </div>
                        </div>
                    </div>
                </div>
            </ClassWrapper>
        </>
    );
}

export default TestReport;
