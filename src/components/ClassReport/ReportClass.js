import React, { useEffect, useState } from 'react';
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
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import moment from 'moment-timezone';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${pad(parseInt(secs / 60), 2)}분 ${pad(Math.floor(secs % 60), 2)}초`;
};

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
    let { activedNum } = match.params;

    /** class-dialog 메소드 */
    // type 4가지 : date-init(과제 공유), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [testDialogopen, setTestDialogopen] = useState(false);
    /** 메인 데이터 및 각 요소 */
    const [mainReportData, setMainReportData] = useState(undefined);
    // 과제 제목
    const [title, setTitle] = useState('');
    // 과제 한 줄 설명
    const [description, setDescription] = useState('');
    // 시선흐름 측정 여부
    const [eyetrack, setEyetrack] = useState(false);
    // 문항 수
    const [problemNumbers, setProblemNumbers] = useState(0);
    // 제한 시간 (초)
    const [timeLimit, setTimeLimit] = useState(0);
    // 과제 시작 날짜
    const [startDate, setStartDate] = useState(null);
    // 과제 종료 날짜
    const [dueDate, setDueDate] = useState(null);
    /** 학생별 데이터 및 각 요소 */
    const [studentsData, setStudentsData] = useState([]);

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
        checked: false,
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

    useEffect(() => {
        // 메인 정보 불러오기
        const { num, activedNum } = match.params;
        console.log(num, activedNum);
        Axios.get(`${apiUrl}/assignment-actived/${parseInt(num)}/${parseInt(activedNum)}`, { withCredentials: true })
            .then((res) => {
                console.log(res);
                let unparsedContentsData = res.data.contents_data;
                try {
                    unparsedContentsData
                        .replace(/\\n/g, '\\n')
                        .replace(/\\'/g, "\\'")
                        .replace(/\\"/g, '\\"')
                        .replace(/\\&/g, '\\&')
                        .replace(/\\r/g, '\\r')
                        .replace(/\\t/g, '\\t')
                        .replace(/\\b/g, '\\b')
                        .replace(/\\f/g, '\\f')
                        .replace(/[\u0000-\u0019]+/g, '');
                } catch (e) {
                    unparsedContentsData = null;
                }
                setMainReportData({ ...res.data, contents_data: JSON.parse(unparsedContentsData) });
            })
            .catch((err) => {
                console.error(err);
            });

        // 학생별 정보 불러오기
        Axios.get(`${apiUrl}/assignment-result/${parseInt(activedNum)}`, {
            params: {
                order: 1,
            },
            withCredentials: true,
        })
            .then((res) => {
                console.log(res);
                const convertedData = res.data.map((data) => {
                    let unparsedUserData = data.user_data;
                    try {
                        unparsedUserData
                            .replace(/\\n/g, '\\n')
                            .replace(/\\'/g, "\\'")
                            .replace(/\\"/g, '\\"')
                            .replace(/\\&/g, '\\&')
                            .replace(/\\r/g, '\\r')
                            .replace(/\\t/g, '\\t')
                            .replace(/\\b/g, '\\b')
                            .replace(/\\f/g, '\\f')
                            .replace(/[\u0000-\u0019]+/g, '');
                    } catch (e) {
                        unparsedUserData = null;
                    }
                    let unparsedEyetrackData = data.eyetrack_data;
                    try {
                        unparsedEyetrackData
                            .replace(/\\n/g, '\\n')
                            .replace(/\\'/g, "\\'")
                            .replace(/\\"/g, '\\"')
                            .replace(/\\&/g, '\\&')
                            .replace(/\\r/g, '\\r')
                            .replace(/\\t/g, '\\t')
                            .replace(/\\b/g, '\\b')
                            .replace(/\\f/g, '\\f')
                            .replace(/[\u0000-\u0019]+/g, '');
                    } catch (e) {
                        unparsedEyetrackData = null;
                    }
                    return {
                        ...data,
                        user_data: JSON.parse(unparsedUserData),
                        eyetrack_data: JSON.parse(unparsedEyetrackData),
                    };
                });
                setStudentsData(convertedData);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (!mainReportData) return;
        console.log(mainReportData);
        setTitle(mainReportData.title);
        setDescription(mainReportData.description);
        setEyetrack(mainReportData.eyetrack);
        setTimeLimit(mainReportData.time_limit);
        setStartDate(moment(mainReportData.created).format('MM.DD HH:mm'));
        setDueDate(moment(mainReportData.due_date).format('MM.DD HH:mm'));

        if (new Date() >= new Date(moment(mainReportData.due_date).format())) {
            setToggleState({ checked: false });
        } else {
            setToggleState({ checked: true });
        }

        if (mainReportData.contents_data) {
            const contentsData = mainReportData.contents_data;
            setProblemNumbers(contentsData.problemDatas.length);
        }
    }, [mainReportData]);

    useEffect(() => {
        if (!studentsData || studentsData.length < 1) return;
        console.log(studentsData);
    }, [studentsData]);

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
                                <h3>{title}</h3>
                            </div>
                            <div className="report-col">
                                <p>{description}</p>
                            </div>
                            <div className="report-col">
                                <div className="left-bottom">
                                    <IsPresence type="eye" able={eyetrack} align="right" />
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
                                    <span className="mid-content">{problemNumbers} 문제</span>
                                </div>
                            </div>

                            <div className="report-col">
                                <div className="mid-mid">
                                    <span className="mid-desc">제한 시간</span>
                                    <span className="mid-content">{timeLimit === -2 ? '없음' : timeValueToTimer(timeLimit)}</span>
                                </div>
                            </div>
                            <div className="report-col">
                                <div className="mid-mid">
                                    <span className="mid-desc">과제 기한</span>
                                    <span className="mid-content">
                                        {startDate} ~ {dueDate}
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
