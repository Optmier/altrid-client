import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import BranchNav from '../essentials/BranchNav';
import ClassWrapper from '../essentials/ClassWrapper';
import Progress from './Progress';
import styled from 'styled-components';
import StudentTypeScore from './StudentTypeScore';
import MoreBox from '../essentials/MoreBox';
import EyeTrackBox from './EyeTrackBox';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Tooltip } from '@material-ui/core';
import TimeTrackBox from './TimeTrackBox';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import moment from 'moment-timezone';
import getAchieveValueForTypes from '../essentials/GetAchieveValueForTypes';
import problemCategories from '../TOFELEditor/ProblemCategories';
import { Element, Link as AnimScrollTo } from 'react-scroll';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${pad(parseInt(secs / 60), 1)}분 ${pad(Math.floor(secs % 60), 1)}초`;
};

const StyleItems = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    font-size: 1rem;
    color: #706d6d;
    font-weight: 400;

    &.critical {
        color: #f57c7c;
    }

    & + & {
        margin-top: 1.25rem;
    }
    & .header-title {
        font-weight: 600;
        width: 92px;
        margin-left: 10px;
    }
`;

const StyleArrowButton = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;

    & > p {
        margin: 0 1rem 0 0;
        font-size: 1rem;
        color: black;
        font-weight: 500;
    }

    & .guide-show-analyze {
        cursor: pointer;
        display: flex;
        justify-content: center;
        color: #2e2c2c;
        line-height: 20px;
        font-size: 16px;
        font-weight: 600;
        width: 100%;
        text-align: center;
        margin: 16px 0 36px 0;
        user-select: none;

        & .expand-icons {
            display: flex;
            flex-direction: column;
            margin-left: 6px;

            & .first {
                margin-top: -6px;
                animation: expandIconOpacity 0.5s 0.6s infinite alternate;
            }
            & .second {
                margin-top: -18px;
                animation: expandIconOpacity 0.5s 0.8s infinite alternate;
            }
        }
    }

    @keyframes expandIconOpacity {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;

const InfoItems = ({ title, contents, children }) => {
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            <div>{contents}</div>
        </StyleItems>
    );
};
const ScoreItems = ({ title, score, total, children }) => {
    let percent = ((score / total) * 100).toFixed(1);
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            {
                <>
                    <div>
                        {score}문제 / {total}문제
                    </div>
                    <div style={{ color: '#13e2a1', paddingLeft: '5px' }}>({percent}%)</div>
                </>
            }
        </StyleItems>
    );
};
const CompareItems = ({ title, contents, children }) => {
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            {contents < 0 ? (
                <div style={{ fontSize: '1.1rem', color: '#F57C7C', fontWeight: '600' }}>{contents.toFixed(1)}%</div>
            ) : contents === 0 ? (
                <div style={{ fontSize: '1.1rem', color: '#C4C4C4', fontWeight: '600' }}>-</div>
            ) : (
                <div style={{ fontSize: '1.1rem', color: '#7C88F5', fontWeight: '600' }}>+ {contents.toFixed(1)}%</div>
            )}
        </StyleItems>
    );
};
const TriesItems = ({ title, tries, children }) => {
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            <div>{tries}회</div>
        </StyleItems>
    );
};
const EraseResultItems = ({ title, children, ...rest }) => {
    return (
        <StyleItems {...rest} className="critical" style={{ cursor: 'pointer' }}>
            {children}
            <div className="header-title">{title}</div>
        </StyleItems>
    );
};

//배열 원하는 길이만큼 2차원 배열로 만들기
const division = (arr, n) => {
    let len = arr.length;
    let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
    let tmp = [];
    let last_tmp = [];

    for (let i = 0; i < cnt; i++) {
        if (arr.length >= n) {
            tmp.push(arr.splice(0, n));
        } else {
            for (let j = 0; j < arr.length; j++) {
                last_tmp.push(arr[j]);
            }
            for (let k = arr.length; k < n; k++) {
                last_tmp.push('-2');
            }
        }
    }

    tmp.push(last_tmp);
    return tmp;
};
function ReportStudent({ history, match }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const urlSearchParams = new URLSearchParams(history.location.search);
    const queryUserId = urlSearchParams.get('user');
    let { activedNum, num } = match.params;
    /** 전체 학생 리포트 데이터 저장 */
    const [studentsData, setStudentsData] = useState([]);
    /** 이름 */
    const [stdName, setStdName] = useState('-');
    /** 제출 날짜 */
    const [submittedDate, setSubmittedDate] = useState('-');
    /** 백분율 점수 */
    const [scorePercentage, setScorePercentage] = useState('-');
    /** 배점 점수 */
    const [scorePoints, setScorePoints] = useState('-');
    /** 총 문제 수 */
    const [totalProblems, setTotalProblems] = useState('-');
    /** 맞은 문제 수 */
    const [correctProblems, setCorrectProblems] = useState(0);
    /** 소요 시간 */
    const [durTimes, setDurTimes] = useState('-');
    /** 제출 횟수 */
    const [tries, setTries] = useState('-');
    /** 답을 변경한 문제 수 */
    const [answerChangedProblems, setAnswerChangedProblems] = useState('-');
    /** 답 변경 후 오답처리된 문제 수 */
    const [aftChangedFaileds, setAftChangedFailds] = useState('-');
    /** 현재 학생 데이터 */
    const [currentStudentData, setCurrentStudentData] = useState({});
    /** 이전 학생 데이터 */
    const [prevStudentData, setPrevStudentData] = useState(null);
    /** 문제 번호별 그룹화된 학생들 패턴 데이터 */
    const [patternDatas, setPatternDatas] = useState([]);
    /** 유형 분석 활성화 달성률 */
    const [achievesForTypes, setAchievesForTypes] = useState({ value: 0, satisfieds: [] });
    /** 현재 학생 영역별 점수 데이터 */
    const [currentScoresPerType, setCurrentScoresPerType] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
    /** 전체 학생 영역별 점수 데이터 */
    const [averageScoresPerType, setAverageScoresPerType] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
    /** 취약 영역 Top 3 */
    const [top3Weaks, setTop3Weaks] = useState([]);
    /** 리포트 초기화 확인 다이얼로그 오픈 여부 */
    const [eraseConfirmOpen, setEraseConfirmOpen] = useState(false);
    /** 리포트 초기화 확인 다이얼로그 텍스트 필드 */
    const [eraseConfirmFields, setEraseConfirmFields] = useState({
        student_name: '',
        teacher_email: '',
    });
    /** 리포트 초기화 확인 다이얼로그 텍스트 필드 에러 여부 */
    const [eraseConfirmFieldsError, setEraseConfirmFieldsError] = useState({
        student_name: false,
        teacher_email: false,
    });

    const handleEraseResult = () => {
        setEraseConfirmOpen(true);
    };

    const handleEraseConfirm = () => {
        if (stdName !== eraseConfirmFields.student_name) {
            setEraseConfirmFieldsError({
                ...eraseConfirmFieldsError,
                student_name: true,
            });
            return;
        }
        Axios.post(`${apiUrl}/auth/check-email-self`, { email: eraseConfirmFields.teacher_email }, { withCredentials: true })
            .then((res) => {
                console.log(res);
                if (res.data.ok) {
                    const conf = window.confirm('정말로 이 학생의 리포트를 초기화 하시겠습니까?');
                    if (!conf) return;
                    Axios.delete(`${apiUrl}/assignment-result/${activedNum}/${queryUserId}`, { withCredentials: true })
                        .then((res) => {
                            console.log(res);
                            history.replace(`/class/${num}/share/${activedNum}`);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                            handleEraseConfirmClose();
                        });
                } else {
                    setEraseConfirmFieldsError({
                        ...eraseConfirmFieldsError,
                        teacher_email: true,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const handleEraseConfirmClose = () => {
        setEraseConfirmOpen(false);
    };
    const handleEraseConfirmFieldsChange = ({ target }) => {
        const { name, value } = target;
        setEraseConfirmFields({
            ...eraseConfirmFields,
            [name]: value,
        });
        setEraseConfirmFieldsError({
            ...eraseConfirmFieldsError,
            [name]: false,
        });
    };

    useEffect(() => {
        Axios.get(`${apiUrl}/assignment-result/${parseInt(activedNum)}`, {
            params: {
                classNumber: num,
            },
            withCredentials: true,
        })
            .then((res) => {
                if (!res.data) return;
                setPrevStudentData(res.data['prev'].filter((p) => p.student_id === queryUserId)[0] || null);
                setStudentsData(
                    res.data['curr'].map((e) => {
                        let unparsedUserData = e.user_data;
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
                        let unparsedEyetrackData = e.eyetrack_data;
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
                        let unparsedContentsData = e.contents_data;
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

                        const _categoryScore = {};
                        if (e.user_data) {
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
                            ...e,
                            user_data: JSON.parse(unparsedUserData),
                            eyetrack_data: JSON.parse(unparsedEyetrackData),
                            contents_data: JSON.parse(unparsedContentsData),
                            category_score: _categoryScore,
                        };
                    }),
                );
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (!studentsData || !studentsData.length) return;
        const currentStudent = studentsData.filter((d) => d.student_id === queryUserId)[0];
        setCurrentStudentData(currentStudent);
        console.log(currentStudent);
        setStdName(currentStudent.name);
        setSubmittedDate(moment(currentStudent.updated).format('YY.MM.DD HH:mm'));
        setScorePercentage(currentStudent.score_percentage);
        setScorePoints(currentStudent.score_points);
        setDurTimes(currentStudent.time);
        setTries(currentStudent.tries);
        if (currentStudent.contents_data) {
            setTotalProblems(currentStudent.contents_data.flatMap((m) => m.problemDatas).length);
            const _o = {};
            currentStudent.contents_data
                .flatMap((m) => m.problemDatas)
                .forEach((d) => {
                    const cat = d.category;
                    !_o[cat] && (_o[cat] = {});
                    !_o[cat].category && (_o[cat].category = 0);
                    !_o[cat].count && (_o[cat].count = 0);
                    _o[cat].category = cat;
                    _o[cat].count += 1;
                });
            setAchievesForTypes(getAchieveValueForTypes(Object.keys(_o).map((k) => _o[k])), 3);
        }
        if (currentStudent.user_data) {
            setCorrectProblems(currentStudent.user_data.selections.filter((d) => d.correct).length);
        }

        setPatternDatas(
            studentsData.map((e) => {
                if (e.user_data) {
                    const currentLogs = e.user_data.logs;
                    const currentSelections = e.user_data.selections;
                    const _currentPattern = {};
                    let currentPatternIdx = 0;
                    let changeCount = 0;
                    currentLogs.map((data) => {
                        switch (data.action) {
                            case 'begin':
                                _currentPattern[currentPatternIdx] = {};
                                _currentPattern[currentPatternIdx].data = [];
                                _currentPattern[currentPatternIdx].data.push(data);
                                _currentPattern[currentPatternIdx].time = 0;
                                _currentPattern[currentPatternIdx].pid = data.pid;
                                _currentPattern[currentPatternIdx].userAnswer = data.answerAfter;
                                _currentPattern[currentPatternIdx].correctAnswer = currentSelections[data.pid].answerCorrect;
                                _currentPattern[currentPatternIdx].correct = data.correct;
                                _currentPattern[currentPatternIdx].answerChanges = 0;
                                _currentPattern[currentPatternIdx].elapsedAtStart = data.time;
                                break;
                            case 'changed':
                                _currentPattern[currentPatternIdx].data.push(data);
                                _currentPattern[currentPatternIdx].time +=
                                    data.time -
                                    _currentPattern[currentPatternIdx].data[_currentPattern[currentPatternIdx].data.length - 2].time;
                                _currentPattern[currentPatternIdx].pid = data.pid;
                                _currentPattern[currentPatternIdx].userAnswer = data.answerAfter;
                                _currentPattern[currentPatternIdx].correctAnswer = currentSelections[data.pid].answerCorrect;
                                _currentPattern[currentPatternIdx].correct = data.correct;
                                _currentPattern[currentPatternIdx].answerChanges += 1;
                                // changeCount++;
                                break;
                            case 'end':
                                _currentPattern[currentPatternIdx].data.push(data);
                                _currentPattern[currentPatternIdx].time +=
                                    data.time -
                                    _currentPattern[currentPatternIdx].data[_currentPattern[currentPatternIdx].data.length - 2].time;
                                _currentPattern[currentPatternIdx].pid = data.pid;
                                _currentPattern[currentPatternIdx].userAnswer = data.answerAfter;
                                _currentPattern[currentPatternIdx].correctAnswer = currentSelections[data.pid].answerCorrect;
                                _currentPattern[currentPatternIdx].correct = data.correct;
                                currentPatternIdx++;
                                changeCount = 0;
                                break;
                        }
                    });
                    const _currentGroupedByPid = [];
                    Object.keys(_currentPattern).map((s) => {
                        !_currentGroupedByPid[_currentPattern[s].pid] && (_currentGroupedByPid[_currentPattern[s].pid] = {});
                        !_currentGroupedByPid[_currentPattern[s].pid].data && (_currentGroupedByPid[_currentPattern[s].pid].data = []);
                        !_currentGroupedByPid[_currentPattern[s].pid].time && (_currentGroupedByPid[_currentPattern[s].pid].time = 0);
                        !_currentGroupedByPid[_currentPattern[s].pid].answerChanges &&
                            (_currentGroupedByPid[_currentPattern[s].pid].answerChanges = 0);
                        _currentGroupedByPid[_currentPattern[s].pid].pid = _currentPattern[s].pid;
                        _currentGroupedByPid[_currentPattern[s].pid].time += _currentPattern[s].time;
                        _currentGroupedByPid[_currentPattern[s].pid].correct = _currentPattern[s].correct;
                        _currentGroupedByPid[_currentPattern[s].pid].answerChanges += _currentPattern[s].answerChanges;
                        _currentGroupedByPid[_currentPattern[s].pid].data.push(_currentPattern[s]);
                    });
                    return {
                        student_id: e.student_id,
                        patternData: _currentPattern,
                        patternsGroupedByPid: _currentGroupedByPid,
                    };
                } else {
                    return {
                        student_id: e.student_id,
                        patternData: null,
                        patternsGroupedByPid: null,
                    };
                }
            }),
        );
        /************* 영역별 점수 값 내기 ************/
        const currentForWeaks = studentsData.filter((d) => d.submitted && d.student_id === queryUserId)[0];
        const totalForWeaks = studentsData.filter((d) => d.submitted);

        if (currentForWeaks && totalForWeaks && totalForWeaks.length) {
            const currentCategoryScores = currentForWeaks.category_score;
            const _currentObjs = {};
            Object.keys(currentCategoryScores).map((c) => {
                const sum = currentCategoryScores[c].sum;
                const count = currentCategoryScores[c].count;
                !_currentObjs[c] && (_currentObjs[c] = 0);
                _currentObjs[c] = (sum / count) * 1.0;
            });
            setCurrentScoresPerType({ ...currentScoresPerType, ..._currentObjs });

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
            const _averages = {};
            Object.keys(_totals).map((c) => {
                !_averages[c] && (_averages[c] = 0);
                _averages[c] = (_totals[c] / totalForWeaks.length) * 1.0;
            });
            setAverageScoresPerType({ ...averageScoresPerType, ..._averages });
        }
        /*************************************/
    }, [studentsData]);

    useEffect(() => {
        const toArray = Object.keys(currentScoresPerType)
            .filter((f) => f !== '0')
            .map((c) => ({ category: c, scores: currentScoresPerType[c] }));
        toArray.push({ category: '0', scores: currentScoresPerType['0'] });
        toArray.sort((a, b) => a.scores - b.scores);
        setTop3Weaks(toArray.filter((d, i) => i < 3));
    }, [currentScoresPerType]);

    useEffect(() => {
        if (!patternDatas || !patternDatas.length) return;
        const curentStudentsPatterns = patternDatas.filter((d) => d.student_id === queryUserId)[0];
        setAnswerChangedProblems(
            curentStudentsPatterns.patternsGroupedByPid
                ? curentStudentsPatterns.patternsGroupedByPid.filter((g) => g.answerChanges > 1).length
                : '-',
        );
        setAftChangedFailds(
            curentStudentsPatterns.patternsGroupedByPid
                ? curentStudentsPatterns.patternsGroupedByPid.filter((g) => g.answerChanges > 1 && !g.correct).length
                : '-',
        );
    }, [patternDatas]);

    return (
        <ClassWrapper col={true}>
            <BranchNav deps="3" />
            <div className="student-report-root">
                <section className="student-report-header">
                    <div className="student-report-left">
                        <div className="ment-ai left-top">
                            {achievesForTypes.value < 100 ? (
                                <>
                                    <b>{stdName}</b> 학생의 리포트 입니다. <br />
                                </>
                            ) : (
                                <>
                                    <b>{stdName}</b> 학생의 취약 영역은 <br />
                                    <b className="underline">
                                        {top3Weaks.length && top3Weaks[0]
                                            ? problemCategories.filter((p) => p.id == top3Weaks[0].category)[0].name
                                            : 'null'}
                                    </b>{' '}
                                    영역입니다.
                                </>
                            )}
                        </div>
                        {achievesForTypes.value >= 100 ? (
                            <>
                                <div className="left-bottom">
                                    <b>2번째 취약 영역</b>
                                    {top3Weaks.length && top3Weaks[1]
                                        ? problemCategories.filter((p) => p.id == top3Weaks[1].category)[0].name
                                        : 'null'}
                                </div>
                                <div className="left-bottom">
                                    <b>3번째 취약 영역</b>
                                    {top3Weaks.length && top3Weaks[2]
                                        ? problemCategories.filter((p) => p.id == top3Weaks[2].category)[0].name
                                        : 'null'}
                                </div>
                            </>
                        ) : null}
                    </div>

                    <div className="student-report-right">
                        {currentStudentData.user_data && currentStudentData.user_data.selections.length > 0
                            ? division(currentStudentData.user_data.selections.slice(), 15).map((arr, idx) => (
                                  <Progress mode key={idx} selections={arr} problemNumbers={999} />
                              ))
                            : null}

                        <div className="right-bottom">
                            <div className="right-bottom-col">
                                <InfoItems title={'제출 날짜'} contents={submittedDate ? submittedDate : '-'}>
                                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5.33333 8H3.55556V9.77778H5.33333V8ZM8.88889 8H7.11111V9.77778H8.88889V8ZM12.4444 8H10.6667V9.77778H12.4444V8ZM14.2222 1.77778H13.3333V0H11.5556V1.77778H4.44444V0H2.66667V1.77778H1.77778C0.791111 1.77778 0.00888888 2.57778 0.00888888 3.55556L0 16C0 16.9778 0.791111 17.7778 1.77778 17.7778H14.2222C15.2 17.7778 16 16.9778 16 16V3.55556C16 2.57778 15.2 1.77778 14.2222 1.77778ZM14.2222 16H1.77778V6.22222H14.2222V16Z"
                                            fill="#706D6D"
                                        />
                                    </svg>
                                </InfoItems>
                                <InfoItems title={'소요 시간'} contents={timeValueToTimer(durTimes)}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M11.392 4.608C10.456 3.672 9.232 3.2 8 3.2V8L4.608 11.392C6.48 13.264 9.52 13.264 11.4 11.392C13.272 9.52 13.272 6.48 11.392 4.608ZM8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8 14.4C4.464 14.4 1.6 11.536 1.6 8C1.6 4.464 4.464 1.6 8 1.6C11.536 1.6 14.4 4.464 14.4 8C14.4 11.536 11.536 14.4 8 14.4Z"
                                            fill="#706D6D"
                                        />
                                    </svg>
                                </InfoItems>
                                <TriesItems title={'시도 횟수'} tries={tries}>
                                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2.66683 3H13.3335C13.6871 3 14.0263 3.15804 14.2763 3.43934C14.5264 3.72064 14.6668 4.10218 14.6668 4.5V13.5C14.6668 13.8978 14.5264 14.2794 14.2763 14.5607C14.0263 14.842 13.6871 15 13.3335 15H2.66683C2.31321 15 1.97407 14.842 1.72402 14.5607C1.47397 14.2794 1.3335 13.8978 1.3335 13.5V4.5C1.3335 4.10218 1.47397 3.72064 1.72402 3.43934C1.97407 3.15804 2.31321 3 2.66683 3V3ZM2.66683 4.5V13.5H7.3335V4.5H2.66683ZM13.3335 13.5V4.5H12.5068C12.6668 4.905 12.6335 5.3025 12.6335 5.3475C12.5868 5.85 12.2735 6.375 12.1602 6.5625L10.6068 8.475L12.8202 8.46L12.8268 9.375L9.36016 9.3525L9.3335 8.6025C9.3335 8.6025 11.3668 6.18 11.4668 5.9625C11.5602 5.7525 11.9402 4.5 11.0002 4.5C10.1802 4.5375 10.2735 5.475 10.2735 5.475L9.24683 5.4825C9.24683 5.4825 9.2535 4.9875 9.50016 4.5H8.66683V13.5H10.3868L10.3802 12.855L11.0268 12.8475C11.0268 12.8475 11.6335 12.7275 11.6402 12.06C11.6668 11.31 11.1002 11.31 11.0002 11.31C10.9135 11.31 10.2868 11.3475 10.2868 11.9625H9.2735C9.2735 11.9625 9.30016 10.4175 11.0002 10.4175C12.7335 10.4175 12.6402 11.9325 12.6402 11.9325C12.6402 11.9325 12.6668 12.87 11.9002 13.2225L12.2468 13.5H13.3335ZM5.94683 12H4.94683V7.65L3.74683 8.07V7.1475L5.84016 6.3075H5.94683V12Z"
                                            fill="#706D6D"
                                        />
                                    </svg>
                                </TriesItems>
                            </div>
                            <div className="right-bottom-col">
                                <ScoreItems title={'점수'} score={correctProblems} total={totalProblems}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.2222 0H1.77778C0.8 0 0 0.8 0 1.77778V14.2222C0 15.2 0.8 16 1.77778 16H14.2222C15.2 16 16 15.2 16 14.2222V1.77778C16 0.8 15.2 0 14.2222 0ZM5.33333 12.4444H3.55556V6.22222H5.33333V12.4444ZM8.88889 12.4444H7.11111V3.55556H8.88889V12.4444ZM12.4444 12.4444H10.6667V8.88889H12.4444V12.4444Z"
                                            fill="#706D6D"
                                        />
                                    </svg>
                                </ScoreItems>
                                <CompareItems
                                    title={'비교 성취도'}
                                    contents={
                                        currentStudentData.score_percentage -
                                        (!prevStudentData || !prevStudentData.score_percentage ? 0 : prevStudentData.score_percentage)
                                    }
                                >
                                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 14.01V7H9V14.01H6L10 18L14 14.01H11ZM4 0L0 3.99H3V11H5V3.99H8L4 0Z" fill="#706D6D" />
                                    </svg>
                                </CompareItems>
                                {sessions.userType === 'students' ? null : (
                                    <EraseResultItems title={'결과 초기화'} onClick={handleEraseResult}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M13.58 6.68262L12.9133 7.98012L4.82667 2.73012L5.49333 1.43262L7.52 2.74512L8.42667 2.46762L11.3133 4.34262L11.56 5.37012L13.58 6.68262ZM4 14.2501V5.25012H7.38L12 8.25012V14.2501C12 14.6479 11.8595 15.0295 11.6095 15.3108C11.3594 15.5921 11.0203 15.7501 10.6667 15.7501H5.33333C4.97971 15.7501 4.64057 15.5921 4.39052 15.3108C4.14048 15.0295 4 14.6479 4 14.2501Z"
                                                fill="#F57C7C"
                                            />
                                        </svg>
                                    </EraseResultItems>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {achievesForTypes.value < 100 ? null : <div className="class-report-title">유형별 정답률</div>}
                <section>
                    {achievesForTypes.value < 100 ? null : <StudentTypeScore current={currentScoresPerType} total={averageScoresPerType} />}
                    <StyleArrowButton>
                        <AnimScrollTo className="guide-show-analyze" to="analyze_page_start" spy={true} smooth={true} duration={700}>
                            {/* <div className="guide-show-analyze"> */}
                            관찰 데이터 확인하기
                            <div className="expand-icons">
                                <ExpandMoreIcon className="first" />
                                <ExpandMoreIcon className="second" />
                            </div>
                            {/* </div> */}
                        </AnimScrollTo>
                    </StyleArrowButton>
                </section>

                <Element name="analyze_page_start"></Element>

                <section className="student-report-observe">
                    <div className="ment-ai observe-ment">
                        <b>{stdName}</b> 학생은 풀이 중 <br />
                        <b className="underline">총 {answerChangedProblems}문제</b>에서 답 변경을 한 후, <br />그 중{' '}
                        <b className="underline">{aftChangedFaileds}문제</b>가 오답 처리되었습니다.
                    </div>
                    <div className="observe-box">
                        <MoreBox />
                    </div>
                </section>

                <div className="class-report-title">
                    <div>시선 흐름 및 패턴 분석</div>
                    <Tooltip title="문제풀이가 진행되는 동안 발생한 시선 이동을 나타냅니다. 시선흐름 측정이 없는 과제의 경우 학습자 문제풀이 패턴 목록만 보여집니다.">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16ZM7.2 4L8.8 4L8.8 8.8H7.2L7.2 4ZM7.2 10.4H8.8V12H7.2V10.4Z"
                                fill="#A9ACAF"
                            />
                        </svg>
                    </Tooltip>
                </div>
                <section className="student-report-eyetrack">
                    {currentStudentData && patternDatas.length ? (
                        <EyeTrackBox
                            hasEyetrack={currentStudentData.eyetrack}
                            eyetrackData={currentStudentData.eyetrack_data}
                            contentsData={currentStudentData.contents_data}
                            patternData={patternDatas.filter((d) => d.student_id === queryUserId)[0].patternData}
                            totalStudentsDatas={studentsData.filter((d) => d.submitted)}
                            currentStudentDatas={studentsData.filter((d) => d.submitted && d.student_id === queryUserId)[0]}
                        />
                    ) : null}
                </section>

                <div className="class-report-title">
                    <div>문제별 시간 분석</div>
                    <Tooltip title="각 문제별 풀이 소요 시간과 최장 소요시간의 문제와 시간을 나타냅니다.">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16ZM7.2 4L8.8 4L8.8 8.8H7.2L7.2 4ZM7.2 10.4H8.8V12H7.2V10.4Z"
                                fill="#A9ACAF"
                            />
                        </svg>
                    </Tooltip>
                </div>
                <section className="student-report-timetrack">
                    {currentStudentData && patternDatas.length ? (
                        <TimeTrackBox
                            data={patternDatas.filter((d) => d.student_id === queryUserId)[0].patternsGroupedByPid}
                            total={patternDatas}
                        />
                    ) : null}
                </section>
            </div>
            <Dialog open={eraseConfirmOpen} onClose={handleEraseConfirmClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" color="secondary">
                    리포트 초기화
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        과제 수행에 문제가 발생한 경우 이 학생의 리포트를 초기화 할 수 있습니다.<br></br>
                        {stdName} 학생의 리포트를 초기화 하려면 학생 성명이랑 선생님 본인의 이메일을 입력하고 초기화를 눌러주세요.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        error={eraseConfirmFieldsError.student_name}
                        required
                        margin="dense"
                        id="student_name"
                        name="student_name"
                        label="학생 성명"
                        type="text"
                        fullWidth
                        value={eraseConfirmFields.student_name}
                        helperText={eraseConfirmFieldsError.student_name ? '리포트와 동일한 학생 성명을 입력해 주세요.' : ''}
                        onChange={handleEraseConfirmFieldsChange}
                    />
                    <TextField
                        error={eraseConfirmFieldsError.teacher_email}
                        required
                        margin="dense"
                        id="teacher_email"
                        name="teacher_email"
                        label="본인 이메일"
                        type="email"
                        fullWidth
                        value={eraseConfirmFields.teacher_email}
                        helperText={eraseConfirmFieldsError.teacher_email ? '본인 이메일 주소를 입력해 주세요.' : ''}
                        onChange={handleEraseConfirmFieldsChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEraseConfirmClose} color="default">
                        취소
                    </Button>
                    <Button onClick={handleEraseConfirm} color="secondary">
                        초기화
                    </Button>
                </DialogActions>
            </Dialog>
        </ClassWrapper>
    );
}

export default withRouter(React.memo(ReportStudent));
