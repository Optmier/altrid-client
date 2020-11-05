import React, { useState } from 'react';
import assignmentDummy from '../../datas/assignmentDummy.json';
import BranchNav from '../essentials/BranchNav';
import ClassWrapper from '../essentials/ClassWrapper';
import IsPresence from '../essentials/IsPresence';
import ToggleSwitch from '../essentials/ToggleSwitch';
import ClassDialog from '../essentials/ClassDialog';
import ModifyButton from '../essentials/ModifyButton';
import StudentNum from '../essentials/StudentNum';
import studentDummy from '../../datas/studentDummy.json';
import TotalProgress from './TotalProgress';
import CardStudent from './CardStudent';
import CardRoot from '../essentials/CardRoot';
import CardLists from '../essentials/CardLists';
import styled from 'styled-components';
import FilterButton from '../essentials/FilterButton';
import ColumnChartProblem from '../essentials/ColumnChartProblem';
import ColumnChartType from '../essentials/ColumnChartType';

const StudentCardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 22px;

    & .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        & .title {
            color: #2e2c2c;
            font-size: 1rem;
            font-weight: 600;
        }
        & select {
            cursor: pointer;
            padding: 0 0.7rem;
            margin-left: 0.7rem;
            border: none;
            outline: none;
            background-color: transparent;
            text-align-last: right;
        }
    }
`;

function ReportClass({ match }) {
    let { classNum } = match.params;

    /** class-dialog 메소드 */
    // type 4가지 : date-init(과제 공유), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
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

    /** toggle state */
    const [toggleState, setToggleState] = useState({
        checked: assignmentDummy[classNum]['progress'],
    });
    const [subTypeState, setSubTypeState] = useState('init');

    const handleToggleChange = (event) => {
        setToggleState({ ...toggleState, [event.target.name]: event.target.checked });

        toggleState['checked'] ? setSubTypeState('init') : setSubTypeState('modify');
        handleDialogOpen('test');
    };

    /** modify state */
    const handleDateChange = () => {
        handleDialogOpen('date');
    };

    /** select state */
    const [selectState, setSelectState] = useState('0');

    const handleSelect = (e) => {
        setSelectState(e.target.value);
    };

    return (
        <div style={{ paddingBottom: '200px' }}>
            <ClassDialog type="test" subType={subTypeState} open={testDialogopen} handleDialogClose={handleTestDialogClose} />
            <ClassDialog type="date" subType="modify" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />

            <ClassWrapper col={true}>
                <BranchNav deps="2" />
                <div className="class-report-root">
                    <section className="class-report-info">
                        <div className="report-box">
                            <div className="report-col">
                                <h3>{assignmentDummy[classNum]['title']}</h3>
                            </div>
                            <div className="report-col">
                                <p>{assignmentDummy[classNum]['desc']}</p>
                            </div>
                            <div className="report-col">
                                <div className="left-bottom">
                                    <IsPresence type="eye" able={assignmentDummy[classNum]['eyetrack']} align="right" />
                                    <ToggleSwitch
                                        toggle={toggleState['checked']}
                                        handleToggleChange={handleToggleChange}
                                        type="share2"
                                        name="checked"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="report-box">
                            <div className="report-col">
                                <div className="mid-mid">
                                    <span className="mid-desc">문항수</span>
                                    <span className="mid-content">{assignmentDummy[classNum]['question_num']}</span>
                                </div>
                            </div>

                            <div className="report-col">
                                <div className="mid-mid">
                                    <span className="mid-desc">제한 시간</span>
                                    <span className="mid-content">{assignmentDummy[classNum]['time']}</span>
                                </div>
                            </div>
                            <div className="report-col">
                                <div className="mid-mid">
                                    <span className="mid-desc">과제 기한</span>
                                    <span className="mid-content">
                                        {assignmentDummy[classNum]['start']} ~ {assignmentDummy[classNum]['start']}
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
                    </section>

                    <section className="class-report-graph">
                        <div className="class-report-title">영역별 리포트</div>
                        <div className="graph-box">
                            <div className="graph-header">
                                <div className="graph-header-text">
                                    <span>가장 취약한 문제 </span> 3번(21%)
                                </div>
                                <div className="graph-header-text">
                                    <span>가장 취약한 유형 </span> 세부내용 찾기(29%)
                                </div>
                                <select name="chart-option" onChange={handleSelect}>
                                    <option value="0">문제별 정답률</option>
                                    <option value="1">유형별 정답률</option>
                                </select>
                            </div>

                            {selectState === '0' ? <ColumnChartProblem /> : <ColumnChartType />}
                        </div>
                    </section>

                    <section className="class-report-progress">
                        <div className="class-report-title">전체 진행률</div>
                        <TotalProgress studentList={studentDummy}></TotalProgress>
                    </section>
                </div>
            </ClassWrapper>

            <CardLists
                upperDeck={
                    <StudentCardHeader className="class-report-student-card">
                        <div className="left">
                            <div className="title">학생별 리포트</div>
                            <select name="student-option">
                                <option value="0">제출순</option>
                                <option value="1">점수순</option>
                                <option value="1">소요시간순</option>
                            </select>
                        </div>
                        <FilterButton />
                    </StudentCardHeader>
                }
            >
                {Object.keys(studentDummy).map((num) => (
                    <CardRoot key={num} cardHeight="250px">
                        <CardStudent num={num} />
                    </CardRoot>
                ))}
            </CardLists>
        </div>
    );
}

export default ReportClass;
