import React, { useCallback, useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { setReportData } from '../../redux_modules/reports';
import getAchieveValueForTypes from '../essentials/GetAchieveValueForTypes';

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
    // type 4가지 : date-init(과제 게시), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
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
    /** 유형 분석 활성화 달성률 */
    const [achievesForTypes, setAchievesForTypes] = useState({ value: 0, satisfieds: [] });
    /** 문제별 평균 정답률 */
    const [avgScoresOfNumber, setAvgScoresOfNumber] = useState([]);
    /** 전체 학생 영역별 평균 점수 데이터 */
    const [averageScoresOfType, setAverageScoresOfType] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });

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

    /** 학생 카드 정렬 */
    const handleSortStudentsCard = ({ target }) => {
        const { name, value } = target;
        // console.log(name, value);
        if (name === 'student-option') {
            switch (value) {
                // 제출 순
                case '0':
                    setStudentsData(
                        studentsData.sort((a, b) => (a.updated < b.updated ? 1 : b.updated < a.updated ? -1 : 0)).map((d) => d),
                    );
                    break;
                // 이름 순
                case '1':
                    setStudentsData(studentsData.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)).map((d) => d));
                    break;
                // 점수 순
                case '2':
                    setStudentsData(
                        studentsData
                            .sort((a, b) =>
                                a.score_percentage < b.score_percentage ? 1 : b.score_percentage < a.score_percentage ? -1 : 0,
                            )
                            .map((d) => d),
                    );
                    break;
                // 소요시간 순
                case '3':
                    setStudentsData(studentsData.sort((a, b) => (a.time < b.time ? 1 : b.time < a.time ? -1 : 0)).map((d) => d));
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        // 메인 정보 불러오기
        const { num, activedNum } = match.params;
        console.log(num, activedNum);
        Axios.get(`${apiUrl}/assignment-actived/${parseInt(num)}/${parseInt(activedNum)}`, { withCredentials: true })
            .then((res) => {
                // console.log(res);
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
                // console.log(res);
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

                    // console.log(data);

                    const _categoryScore = {};
                    if (data.user_data) {
                        const userSelections = JSON.parse(unparsedUserData).selections;
                        userSelections.forEach((e) => {
                            !_categoryScore[e.category] && (_categoryScore[e.category] = {});
                            !_categoryScore[e.category].sum && (_categoryScore[e.category].sum = 0);
                            _categoryScore[e.category].sum += e.correct ? 1 : 0;
                            !_categoryScore[e.category].count && (_categoryScore[e.category].count = 0);
                            _categoryScore[e.category].count += 1;
                        });
                    }

                    return {
                        ...data,
                        user_data: JSON.parse(unparsedUserData),
                        eyetrack_data: JSON.parse(unparsedEyetrackData),
                        category_score: _categoryScore,
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
            setProblemNumbers(contentsData.flatMap((m) => m.problemDatas).length);
            const _o = {};
            contentsData
                .flatMap((m) => m.problemDatas)
                .forEach((d) => {
                    const cat = d.category;
                    !_o[cat] && (_o[cat] = {});
                    !_o[cat].category && (_o[cat].category = 0);
                    !_o[cat].count && (_o[cat].count = 0);
                    _o[cat].category = cat;
                    _o[cat].count += 1;
                });
            console.log(_o);
            setAchievesForTypes(getAchieveValueForTypes(Object.keys(_o).map((k) => _o[k])), 3);
        }
    }, [mainReportData]);

    useEffect(() => {
        if (!studentsData || studentsData.length < 1) return;
        console.log(studentsData);
        /** 여기에 계산함수 구현하면 됩니다. */
        const _sumOfScoresPerNumbers = {};
        const len = studentsData
            .filter(({ submitted }) => submitted)
            .map(({ user_data }) => {
                const curSelections = user_data.selections;
                curSelections.forEach((s, i) => {
                    !_sumOfScoresPerNumbers[i] && (_sumOfScoresPerNumbers[i] = 0);
                    _sumOfScoresPerNumbers[i] += s.correct ? 1 : 0;
                });
            }).length;
        const averagesOfNumber = Object.keys(_sumOfScoresPerNumbers).map((n) => (_sumOfScoresPerNumbers[n] / len) * 100.0);
        setAvgScoresOfNumber(averagesOfNumber);
        // console.log(averagesOfNumber);
        const totalForWeaks = studentsData.filter((d) => d.submitted);
        if (totalForWeaks && totalForWeaks.length) {
            // 전체 학생 영역별 정답 합산
            const _totals = {};
            totalForWeaks.forEach((e) => {
                const categoryScores = e.category_score;
                Object.keys(categoryScores).map((c) => {
                    const sum = categoryScores[c].sum;
                    const count = categoryScores[c].count;
                    !_totals[c] && (_totals[c] = 0);
                    _totals[c] += (sum / count) * 1.0;
                });
            });
            // 전체 학생 영역별 합산 점수에서 평균 구하기
            const _averages = {};
            Object.keys(_totals).map((c) => {
                !_averages[c] && (_averages[c] = 0);
                _averages[c] = (_totals[c] / totalForWeaks.length) * 1.0;
            });
            setAverageScoresOfType({ ...averageScoresOfType, ..._averages });
        }
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
                                    <StudentNum
                                        completeNum={studentsData.filter((s) => s.submitted).length}
                                        totalNum={studentsData.length}
                                        width="75%"
                                    />
                                </div>
                            </div>
                            <div className="report-col">
                                <div className="right-bottom">제출한 학생</div>
                            </div>
                        </div>
                    </section>
                    {/* {console.log(achievesForTypes)} */}
                    <section className="class-report-graph">
                        <div className="class-report-title">영역별 리포트</div>
                        <div className="graph-box">
                            <div className="graph-header">
                                <div className="graph-header-text">
                                    <span>가장 취약한 문제 </span> 3번(21%)
                                </div>
                                {achievesForTypes.value >= 100 ? (
                                    <div className="graph-header-text">
                                        <span>가장 취약한 유형 </span> 세부내용 찾기(29%)
                                    </div>
                                ) : null}
                                <select name="chart-option" onChange={handleSelect}>
                                    <option value="0">문제별 정답률</option>
                                    {achievesForTypes.value >= 100 ? <option value="1">유형별 정답률</option> : null}
                                </select>
                            </div>

                            {selectState === '0' ? <ColumnChartProblem datas={avgScoresOfNumber} /> : <ColumnChartType />}
                        </div>
                    </section>

                    <section className="class-report-progress">
                        <div className="class-report-title">전체 진행률</div>
                        <TotalProgress studentList={studentsData} problemNumbers={problemNumbers}></TotalProgress>
                    </section>
                </div>
            </ClassWrapper>

            <CardLists
                upperDeck={
                    <StudentCardHeader className="class-report-student-card">
                        <div className="left">
                            <div className="title">학생별 리포트</div>
                            <select name="student-option" onChange={handleSortStudentsCard}>
                                <option value="0">제출 순</option>
                                <option value="1">이름 순</option>
                                <option value="2">점수 순</option>
                                <option value="3">소요시간 순</option>
                            </select>
                        </div>
                        <FilterButton />
                    </StudentCardHeader>
                }
            >
                {studentsData.map((data) => (
                    <CardRoot key={data.student_id} cardHeight="250px">
                        <CardStudent id={data.student_id} data={data} totalProblems={problemNumbers} />
                    </CardRoot>
                ))}
            </CardLists>
        </div>
    );
}

export default ReportClass;
