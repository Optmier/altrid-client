/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-control-regex */
import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import ClassWrapper from '../essentials/ClassWrapper';
import Progress from './Progress';
import styled from 'styled-components';
import StudentTypeScore from './StudentTypeScore';
import EyeTrackBox from './EyeTrackBox';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, TextField } from '@material-ui/core';
import problemCategories from '../TOFELEditor/ProblemCategories';
import TimeTrackBox from './TimeTrackBox';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import moment from 'moment-timezone';
import getAchieveValueForTypes from '../essentials/GetAchieveValueForTypes';
import { Element } from 'react-scroll';
import { useSelector, useDispatch } from 'react-redux';
import BackdropComponent from '../essentials/BackdropComponent';
import TooltipCard from '../essentials/TooltipCard';
import { changeParams } from '../../redux_modules/params';
import { deleteHandsUpProblems, getHandsUpProblems, getSelectedHandsUpProblems, handsUpProblems } from './QnA/HandsUpInterface';
import {
    getTeacherFeedbackInterface,
    TeacherFeedbackViewer,
    TeacherFeedbackWriter,
    updateTeacherFeedbackInterface,
} from './ReportStudent/TeacherFeedback';
import ScoringResults from './ReportStudent/ScoringResults';
import GroupBox from '../../AltridUI/GroupBox/GroupBox';
import Button from '../../AltridUI/Button/Button';
import EyeTrackChart from './EyeTrackChart';
import MakeAutoComments from '../../controllers/MakeAutoComment';

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

    &.critical {
        color: #f57c7c;
    }

    & + & {
        margin-top: 1.25rem;
    }
    & .header-title {
        font-weight: 600;
        width: 105px;
        margin-left: 10px;
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
const ScoreItems = ({ title, score, total, percent, children }) => {
    // let percent = ((score / total) * 100).toFixed(1);
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            {
                <>
                    <div>
                        {score}문제 / {total}문제
                    </div>
                    <div style={{ color: '#13e2a1', paddingLeft: '5px' }}>({percent.toFixed(1)}%)</div>
                </>
            }
        </StyleItems>
    );
};
ScoreItems.defaultProps = {
    percent: 0,
};
const CompareItems = ({ title, contents, children }) => {
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            {contents < 0 ? (
                <div style={{ color: '#F57C7C' }}>{contents.toFixed(1)}%</div>
            ) : contents === 0 ? (
                <div style={{ color: '#C4C4C4' }}>-</div>
            ) : (
                <div style={{ color: '#7C88F5' }}>+ {contents.toFixed(1)}%</div>
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
const division = (arr, original, n) => {
    // console.log(original);
    const _arr = arr.slice();
    const _original = original.slice();
    const origLen = _original.length;
    const splitCnt = Math.floor(origLen / n) + (Math.floor(origLen % n) > 0 ? 1 : 0);
    const results = [];

    for (let i = 0; i < splitCnt; i++) {
        const _spliced = _original.splice(0, n);
        if (_spliced.length >= n) results.push(_spliced.map((d, idx) => (_arr[idx + i * n] ? _arr[idx + i * n] : -1)));
        else {
            const _rests = [];
            for (let idx = 0; idx < n; idx++) {
                _rests.push(_spliced[idx] ? (_arr[idx + i * n] ? _arr[idx + i * n] : -1) : -2);
            }
            results.push(_rests);
        }
    }

    return results;
};
// const HTMLTooltip = withStyles((theme) => ({
//     tooltip: {
//         padding: '0.85rem 1rem',
//         fontSize: '0.85rem',
//         fontWeight: '500',
//         borderRadius: '5px',
//     },
// }))(Tooltip);

function ReportStudent({ history, match }) {
    // console.log(history, match);
    const dispatch = useDispatch();
    const sessions = useSelector((state) => state.RdxSessions);
    const urlSearchParams = new URLSearchParams(history.location.search);
    const queryUserId = urlSearchParams.get('user');
    let { activedNum, num } = match.params;
    /** 전체 학생 리포트 데이터 저장 */
    const [studentsData, setStudentsData] = useState([]);
    window.studentData = studentsData;
    /** 이름 */
    const [stdName, setStdName] = useState('-');
    /** 제출 날짜 */
    const [submittedDate, setSubmittedDate] = useState('-');
    /** 과목 */
    const [subject, setSubject] = useState(1);
    /** 백분율 점수 */
    const [scorePercentage, setScorePercentage] = useState(0);
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
    /** 과제 title */
    const [title, setTitle] = useState('-');
    /** 답을 변경한 문제 수 */
    const [answerChangedProblems, setAnswerChangedProblems] = useState('-');
    /** 답 변경 후 오답처리된 문제 수 */
    const [aftChangedFaileds, setAftChangedFailds] = useState('-');
    /** 현재 학생 데이터 */
    const [currentStudentData, setCurrentStudentData] = useState({});
    window.showdatas = currentStudentData;
    /** 이전 학생 데이터 */
    const [prevStudentData, setPrevStudentData] = useState(null);
    /** 문제 번호별 그룹화된 학생들 패턴 데이터 */
    const [patternDatas, setPatternDatas] = useState([]);
    /** 유형 분석 활성화 달성률 */
    const [achievesForTypes, setAchievesForTypes] = useState({ value: 0, satisfieds: [], allExists: [] });
    /** 현재 학생 영역별 점수 데이터 */
    const [currentScoresPerType, setCurrentScoresPerType] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
    /** 전체 학생 영역별 점수 데이터 */
    const [averageScoresPerType, setAverageScoresPerType] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
    /** 취약 영역 Top 3 */
    const [top3Weaks, setTop3Weaks] = useState([]);
    /** 리포트 초기화 확인 다이얼로그 오픈 여부 */
    const [eraseConfirmOpen, setEraseConfirmOpen] = useState(false);
    /** 리포트 초기화 확인 다이얼로그 텍스트 필드 (ref) */
    // const [eraseConfirmFields, setEraseConfirmFields] = useState({
    //     student_name: '',
    //     teacher_email: '',
    // });
    const eraseConfirmStudentNameField = useRef();
    const eraseConfirmTeacherEmailField = useRef();
    /** 리포트 초기화 확인 다이얼로그 텍스트 필드 에러 여부 */
    const [eraseConfirmFieldsError, setEraseConfirmFieldsError] = useState({
        student_name: false,
        teacher_email: false,
    });
    /**전체 로딩 */
    const [mainLoading, setMainLoading] = useState(true);
    /** 유형별 분석 select state */
    const [typeSelectState, setTypeSelectState] = useState('0');

    //const [handsUpList, setHandsUpList] = useState([]);
    const [teacherFeedbackContents, setTeacherFeedbackContents] = useState({ renderContents: null, deltaContents: null });

    const [scoringResultsOpen, setScoringResultsOpen] = useState(false);

    const handleTypeSelect = (e) => {
        setTypeSelectState(e.target.value);
    };
    const handleEraseResult = () => {
        setEraseConfirmOpen(true);
    };

    const handleEraseConfirm = () => {
        if (stdName !== eraseConfirmStudentNameField.current.value) {
            setEraseConfirmFieldsError({
                ...eraseConfirmFieldsError,
                student_name: true,
            });
            return;
        }
        Axios.post(`${apiUrl}/auth/check-email-self`, { email: eraseConfirmTeacherEmailField.current.value }, { withCredentials: true })
            .then((res) => {
                // console.log(res);
                if (res.data.ok) {
                    const conf = window.confirm('정말로 이 학생의 리포트를 초기화 하시겠습니까?');
                    if (!conf) return;
                    Axios.delete(`${apiUrl}/assignment-result/${activedNum}/${queryUserId}`, { withCredentials: true })
                        .then((res) => {
                            // console.log(res);
                            history.replace(`/class/${num}/share/${activedNum}`);
                        })
                        .catch((err) => {
                            console.error(err);
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
        const { name } = target;
        if (eraseConfirmFieldsError[name]) {
            setEraseConfirmFieldsError({
                ...eraseConfirmFieldsError,
                [name]: false,
            });
        }
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
                Axios.get(`${apiUrl}/assignment-result/contents-data/${parseInt(activedNum)}`, {
                    params: {
                        classNumber: num,
                    },
                    withCredentials: true,
                })
                    .then((contentsData) => {
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
                                let unparsedContentsData = contentsData.data.contents_data;
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
            })
            .catch((err) => {
                console.error(err);
            });

        getTeacherFeedbackInterface(activedNum, queryUserId, {
            onSuccess(res) {
                setTeacherFeedbackContents(res);
            },
            onFailure(err) {
                console.error(err);
            },
        });
    }, []);

    useEffect(() => {
        if (!studentsData || !studentsData.length) return;

        const currentStudent = studentsData.filter((d) => d.student_id === queryUserId)[0];
        setCurrentStudentData(currentStudent);
        // console.log(currentStudent);
        setStdName(currentStudent.name);
        setSubject(currentStudent.subject);
        setSubmittedDate(moment(currentStudent.updated).format('YY.MM.DD HH:mm'));
        setScorePercentage(currentStudent.score_percentage);
        setScorePoints(currentStudent.score_points);
        setDurTimes(currentStudent.time);
        setTries(currentStudent.tries);
        setTitle(currentStudent.title);
        dispatch(changeParams(3, activedNum));

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

            // 손들기 데이터 불러오기!!
            getHandsUpProblems(currentStudent.student_id, currentStudent.actived_number, {
                onSuccess(res) {
                    const idxs = [];
                    for (let id in res.data) {
                        idxs.push(res.data[id][0].problemAbsIdx);
                    }
                    setHandsUpList([...handsUpList, ...idxs]);
                },
                onFailure(error) {},
            });
            getSelectedHandsUpProblems(currentStudent.actived_number, {
                onSuccess(res) {
                    const idxs = [];
                    for (let id in res.data) {
                        idxs.push(res.data[id][0].problemAbsIdx);
                    }
                    setTeacherSelectedList([...teacherSelectedList, ...idxs]);
                },
                onFailure(error) {},
            });
        }
        if (currentStudent.user_data) {
            setCorrectProblems(currentStudent.user_data.selections.filter((d) => d.correct).length);
        }

        setPatternDatas(
            studentsData.map((e) => {
                if (e.user_data) {
                    //console.log(e);
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

                            default:
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
                        return null;
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
                return null;
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
                    return null;
                });
            });
            const _averages = {};
            Object.keys(_totals).map((c) => {
                !_averages[c] && (_averages[c] = 0);
                _averages[c] = (_totals[c] / totalForWeaks.length) * 1.0;
                return null;
            });
            setAverageScoresPerType({ ...averageScoresPerType, ..._averages });
        }
        /*************************************/
    }, [studentsData]);

    useEffect(() => {
        const toArray = Object.keys(currentScoresPerType)
            .filter((f) => f !== '0')
            .map((c) => ({ category: c, scores: currentScoresPerType[c] }));
        // toArray.push({ category: '0', scores: currentScoresPerType['0'] });
        toArray.sort((a, b) => a.scores - b.scores);
        setTop3Weaks(
            toArray
                .filter(({ category }) => achievesForTypes.allExists.map((d) => d.category + '').includes(category))
                .filter((d, i) => i < 3),
        );
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
        setMainLoading(false);
    }, [patternDatas]);

    const [handsUpList, setHandsUpList] = useState([]);
    const [teacherSelectedList, setTeacherSelectedList] = useState([]);

    const progressDoubleClick = (index, qUUID, handsUp, teacherSelected) => {
        if (sessions.userType !== 'students') return;
        const confirm = window.confirm(
            !handsUp
                ? '정말로 이 문제에 대해 손들기를 하시겠습니까?'
                : teacherSelected
                ? '손들기를 취소하시겠습니까?\n다른 학생이 손을 들지 않은 경우 선생님 선택 목록에도 삭제됩니다!'
                : '손들기를 취소하시겠습니까?',
        );
        if (!confirm) return;
        let count = 0;
        let result = {};
        for (let c of currentStudentData.contents_data) {
            const length = c.problemDatas.length;
            if (index < count + length) {
                const problemData = c.problemDatas[index - count];
                result.assignmentNo = currentStudentData.actived_number;
                try {
                    result.studentAnswer = currentStudentData.user_data.selections[index].answerUser;
                } catch (error) {
                    result.studentAnswer = null;
                }
                result.correctAnswer = problemData.answer;
                result.studentId = currentStudentData.student_id;
                result.questionId = problemData.uuid;
                break;
            }
            count += length;
        }
        if (handsUp) {
            deleteHandsUpProblems([result.questionId], {
                onSuccess() {
                    setHandsUpList(handsUpList.filter((idx) => idx !== index));
                    Axios.patch(
                        `${apiUrl}/data-analytics/hands-up`,
                        {
                            assignmentNo: result.assignmentNo,
                            questionIds: [result.questionId],
                            isHandsUp: false,
                        },
                        { withCredentials: true },
                    )
                        .then((res) => {})
                        .catch((err) => {
                            console.error(err);
                        });
                },
                onFailure() {},
            });
        } else {
            handsUpProblems([result], {
                onSuccess() {
                    setHandsUpList([...handsUpList, index]);
                    Axios.patch(
                        `${apiUrl}/data-analytics/hands-up`,
                        {
                            assignmentNo: result.assignmentNo,
                            questionIds: [result.questionId],
                            isHandsUp: true,
                        },
                        { withCredentials: true },
                    )
                        .then((res) => {})
                        .catch((err) => {
                            console.error(err);
                        });
                },
                onFailure() {},
            });
        }
    };

    const actionUpdateTeacherFeedback = (contentsData) => {
        updateTeacherFeedbackInterface(activedNum, queryUserId, contentsData, {
            onSuccess(res) {
                alert('성공적으로 업데이트 되었습니다!');
            },
            onFailure(err) {
                console.error(err);
                alert('업데이트에 실패했습니다.');
            },
        });
    };

    const [acmTotalFixsMine, setACMTotalFixsMine] = useState(0);
    const [acmTotalFixsAvg, setACMTotalFixsAvg] = useState(0);
    const [acmAvgSpeedFixsMine, setACMAvgSpeedFixsMine] = useState(0);
    const [acmAvgSpeedFixsAvg, setACMAvgSpeedFixsAvg] = useState(0);
    const [acmRegressionsMine, setACMRegressionsMine] = useState(0);
    const [acmRegressionsAvg, setACMRegressionsAvg] = useState(0);

    if (mainLoading) return <BackdropComponent open={true} />;
    // const preventDefault = (event) => event.preventDefault();
    return (
        <>
            {/* <StyleArrowButton>
                <AnimScrollTo className="guide-show-analyze" to="analyze_page_start" spy={true} smooth={true} duration={700}>
                   
                    AI 데이터 확인하기
                    <div className="expand-icons">
                        <ExpandMoreIcon className="first" />
                        <ExpandMoreIcon className="second" />
                    </div>
              
                </AnimScrollTo>
            </StyleArrowButton> */}
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
                        inputRef={eraseConfirmStudentNameField}
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
                        inputRef={eraseConfirmTeacherEmailField}
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

            <ClassWrapper col={true}>
                <div className="student-report-root">
                    <section className="student-report-header">
                        <div className="student-report-top">
                            <div className="name">상세 리포트</div>
                            <div className="class-name">
                                <span>{stdName} 학생</span>
                                {title}
                            </div>
                        </div>
                        <div className="white-box student-report-bottom">
                            <div className="bottom-col">
                                <InfoItems title={'제출 날짜'} contents={submittedDate ? submittedDate : '-'}></InfoItems>
                                <InfoItems title={'소요 시간'} contents={timeValueToTimer(durTimes)}></InfoItems>
                                <TriesItems title={'시도 횟수'} tries={tries}></TriesItems>
                            </div>
                            <div className="bottom-col">
                                <ScoreItems
                                    title={'점수'}
                                    score={correctProblems}
                                    total={totalProblems}
                                    percent={scorePercentage}
                                ></ScoreItems>
                                <CompareItems
                                    title={'비교 성취도'}
                                    contents={
                                        currentStudentData.score_percentage -
                                        (!prevStudentData || !prevStudentData.score_percentage ? 0 : prevStudentData.score_percentage)
                                    }
                                ></CompareItems>
                                {sessions.userType === 'students' ? null : (
                                    <EraseResultItems title={'결과 초기화'} onClick={handleEraseResult}></EraseResultItems>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="student-report-progress">
                        <GroupBox
                            title="문제별 채점 결과"
                            rightComponent={
                                <>
                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setScoringResultsOpen(true);
                                        }}
                                    >
                                        <Button variant="light" colors="purple">
                                            채점결과 상세보기
                                        </Button>
                                    </Link>
                                </>
                            }
                        />
                        <div style={{ paddingBottom: '30px' }} className="progress">
                            {currentStudentData.user_data && currentStudentData.user_data.selections.length > 0
                                ? division(
                                      currentStudentData.user_data.selections,
                                      currentStudentData.contents_data.flatMap((m) => m.problemDatas),
                                      15,
                                  ).map((arr, idx) => (
                                      <Progress
                                          mode
                                          key={idx}
                                          idx={idx}
                                          selections={arr}
                                          problemNumbers={999}
                                          handsUp={handsUpList}
                                          teacherSelected={teacherSelectedList}
                                          onDoubleClick={progressDoubleClick}
                                      />
                                  ))
                                : null}
                            <ScoringResults
                                open={scoringResultsOpen}
                                userData={currentStudentData.user_data.selections}
                                handsUp={handsUpList}
                                teacherSelected={teacherSelectedList}
                                spentTime={patternDatas.filter((d) => d.student_id === queryUserId)[0].patternsGroupedByPid}
                                contentsData={currentStudentData.contents_data}
                                actionClickHandsUpButton={progressDoubleClick}
                                handleClose={() => {
                                    setScoringResultsOpen(false);
                                }}
                            />
                        </div>
                    </section>

                    <section className="student-report-timetrack">
                        <GroupBox title="문제별 시간 분석" />
                        {currentStudentData && patternDatas.length ? (
                            <TimeTrackBox
                                data={patternDatas.filter((d) => d.student_id === queryUserId)[0].patternsGroupedByPid}
                                total={patternDatas}
                                totalProblems={totalProblems}
                            />
                        ) : null}
                    </section>

                    {sessions.userType === 'students' && achievesForTypes.value < 100 ? null : (
                        <section className="student-report-type-analysis">
                            <GroupBox
                                title="유형별 분석"
                                // rightComponent={
                                //     sessions.userType === 'students' ? null : (
                                //         <div className="title-graph-right">
                                //             <TypeBanner
                                //                 situation={achievesForTypes.value < 100 ? 'warning' : 'success'}
                                //                 value={achievesForTypes.value}
                                //             />
                                //         </div>
                                //     )
                                // }
                            />

                            <div className="white-box">
                                <div className="ment-ai">
                                    <div className="ment-ai-col">
                                        <div>
                                            <svg
                                                style={{ marginRight: '16px' }}
                                                width="34"
                                                height="22"
                                                viewBox="0 0 34 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M11.1755 0.0157251C11.4912 -0.047176 11.6806 0.0786284 11.7437 0.393139C11.8069 0.644745 11.6806 0.802003 11.3649 0.864904C9.02877 1.36812 7.10308 2.18585 5.58773 3.31808C4.13556 4.38742 3.40947 5.55112 3.40947 6.80914C3.40947 7.56397 3.66203 8.16153 4.16713 8.60186C4.73538 9.04219 6.40852 9.57683 9.18661 10.2058C11.1439 10.7091 12.5645 11.4325 13.4485 12.376C14.3956 13.3195 14.8691 14.5461 14.8691 16.0557C14.8691 17.7541 14.2693 19.1694 13.0696 20.3016C11.87 21.4339 10.3231 22 8.42898 22C5.96657 22 3.94615 21.1508 2.36769 19.4524C0.789231 17.6912 0 15.4582 0 12.7534C0 9.48247 0.978645 6.74623 2.93593 4.54467C4.95634 2.3431 7.70287 0.833454 11.1755 0.0157251ZM30.2117 0.0157251C30.5274 -0.047176 30.7168 0.0786284 30.78 0.393139C30.9062 0.644745 30.8115 0.802003 30.4958 0.864904C28.1597 1.36812 26.234 2.18585 24.7187 3.31808C23.2665 4.38742 22.5404 5.55112 22.5404 6.80914C22.5404 7.56397 22.7929 8.16153 23.298 8.60186C23.8032 9.04219 25.4447 9.57683 28.2228 10.2058C30.2433 10.7091 31.6954 11.4325 32.5794 12.376C33.5264 13.3195 34 14.5461 34 16.0557C34 17.7541 33.4002 19.1694 32.2005 20.3016C31.0009 21.4339 29.4541 22 27.5599 22C25.0975 22 23.077 21.1194 21.4986 19.3581C19.9202 17.534 19.1309 15.238 19.1309 12.4703C19.1309 9.26233 20.1096 6.589 22.0669 4.45032C24.0242 2.31165 26.7391 0.833454 30.2117 0.0157251Z"
                                                    fill="#AEFFE0"
                                                />
                                            </svg>
                                            <TooltipCard title={stdName}>
                                                <b className="ment-ai-name">{stdName} </b>
                                            </TooltipCard>
                                            학생의 취약 영역은
                                        </div>
                                        <div>
                                            {achievesForTypes.value < 100 ? (
                                                <span className="ment-ai-nounderline">-</span>
                                            ) : (
                                                <span className="ment-ai-underline">
                                                    {top3Weaks.length && top3Weaks[0] ? (
                                                        <TooltipCard
                                                            title={
                                                                problemCategories.filter((p) => p.id === parseInt(top3Weaks[0].category))[0]
                                                                    .name
                                                            }
                                                        >
                                                            <>
                                                                {
                                                                    problemCategories.filter(
                                                                        (p) => p.id === parseInt(top3Weaks[0].category),
                                                                    )[0].name
                                                                }
                                                            </>
                                                        </TooltipCard>
                                                    ) : null}
                                                </span>
                                            )}{' '}
                                            영역입니다.
                                        </div>
                                    </div>
                                    <div className="ment-ai-col">
                                        <div className="ment-ai-row">
                                            <span className="row-title">2번째 취약 영역</span>
                                            <span className="row-desc">
                                                {achievesForTypes.value < 100
                                                    ? '-'
                                                    : top3Weaks.length && top3Weaks[1]
                                                    ? problemCategories.filter((p) => p.id === parseInt(top3Weaks[1].category))[0].name
                                                    : 'null'}
                                            </span>
                                        </div>
                                        <div className="ment-ai-row">
                                            <span className="row-title">3번째 취약 영역</span>
                                            <span className="row-desc">
                                                {achievesForTypes.value < 100
                                                    ? '-'
                                                    : top3Weaks.length && top3Weaks[2]
                                                    ? problemCategories.filter((p) => p.id === parseInt(top3Weaks[2].category))[0].name
                                                    : 'null'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {achievesForTypes.value < 100 ? (
                                <StudentTypeScore
                                    enabled={achievesForTypes.allExists}
                                    current={0}
                                    total={0}
                                    subject={subject}
                                    typeSelectState={typeSelectState}
                                    handleTypeSelect={handleTypeSelect}
                                    achieveValue={achievesForTypes.value}
                                    stdName={stdName}
                                />
                            ) : (
                                <StudentTypeScore
                                    enabled={achievesForTypes.allExists}
                                    current={currentScoresPerType}
                                    total={averageScoresPerType}
                                    subject={subject}
                                    typeSelectState={typeSelectState}
                                    handleTypeSelect={handleTypeSelect}
                                    achieveValue={achievesForTypes.value}
                                    stdName={stdName}
                                />
                            )}
                        </section>
                    )}

                    <Element name="analyze_page_start"></Element>
                    <section className="student-report-observe">
                        <GroupBox title="시선 흐름 및 패턴 분석" />
                        {/* 시선 흐름 및 패턴 분석
                                <HTMLTooltip title="문제풀이가 진행되는 동안 발생한 시선 이동을 나타냅니다. 시선흐름 측정이 없는 과제의 경우 학습자 문제풀이 패턴 목록만 보여집니다.">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16ZM7.2 4L8.8 4L8.8 8.8H7.2L7.2 4ZM7.2 10.4H8.8V12H7.2V10.4Z"
                                            fill="#A9ACAF"
                                        />
                                    </svg>
                                </HTMLTooltip> */}

                        {/* <div className="title-graph-right">
                                <TypeBanner situation={'info'} value={achievesForTypes.value} />
                            </div> */}

                        {currentStudentData && patternDatas.length ? (
                            <EyeTrackBox
                                hasEyetrack={currentStudentData.eyetrack}
                                eyetrackData={currentStudentData.eyetrack_data}
                                contentsData={currentStudentData.contents_data}
                                patternData={patternDatas.filter((d) => d.student_id === queryUserId)[0].patternData}
                                totalStudentsDatas={studentsData.filter((d) => d.submitted)}
                                currentStudentDatas={studentsData.filter((d) => d.submitted && d.student_id === queryUserId)[0]}
                                userId={queryUserId}
                                activedNum={activedNum}
                                stdName={stdName}
                                answerChangedProblems={answerChangedProblems}
                                aftChangedFaileds={aftChangedFaileds}
                            />
                        ) : // </Typography>
                        // </AccordionDetails>
                        // </Accordion>
                        null}
                    </section>

                    <section className="AI-comment">
                        <GroupBox title="AI-Comment" />

                        <div className="white-box ment-ai">
                            <div className="ment-ai-col">
                                {currentStudentData && patternDatas.length ? (
                                    <EyeTrackChart
                                        hasEyetrack={currentStudentData.eyetrack}
                                        eyetrackData={currentStudentData.eyetrack_data}
                                        contentsData={currentStudentData.contents_data}
                                        patternData={patternDatas.filter((d) => d.student_id === queryUserId)[0].patternData}
                                        totalStudentsDatas={studentsData.filter((d) => d.submitted)}
                                        currentStudentDatas={studentsData.filter((d) => d.submitted && d.student_id === queryUserId)[0]}
                                        userId={queryUserId}
                                        activedNum={activedNum}
                                        stdName={stdName}
                                        answerChangedProblems={answerChangedProblems}
                                        aftChangedFaileds={aftChangedFaileds}
                                        setACMS={{
                                            totalFixsMine: setACMTotalFixsMine,
                                            totalFixsAvg: setACMTotalFixsAvg,
                                            avgSpeedFixsMine: setACMAvgSpeedFixsMine,
                                            avgSpeedFixsAvg: setACMAvgSpeedFixsAvg,
                                            regressionsMine: setACMRegressionsMine,
                                            regressionsAvg: setACMRegressionsAvg,
                                        }}
                                    />
                                ) : (
                                    <p>시선추적이 포함되지 않은 과제입니다.</p>
                                )}
                            </div>
                            <div className="ment-ai-col" id="no-eyetrack">
                                <h5>
                                    {/* AI comment 영역 */}
                                    {MakeAutoComments(
                                        stdName,
                                        acmTotalFixsMine,
                                        acmTotalFixsAvg,
                                        acmAvgSpeedFixsMine,
                                        acmAvgSpeedFixsAvg,
                                        acmRegressionsMine,
                                        acmRegressionsAvg,
                                    )}
                                    <br />
                                </h5>
                            </div>
                        </div>
                    </section>

                    <section className="student-report-observe">
                        <GroupBox title="선생님 피드백" />
                        {/* <div className="observe-header">
                                선생님 피드백
                                {/* <HTMLTooltip title="문제풀이가 진행되는 동안 발생한 시선 이동을 나타냅니다. 시선흐름 측정이 없는 과제의 경우 학습자 문제풀이 패턴 목록만 보여집니다.">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16ZM7.2 4L8.8 4L8.8 8.8H7.2L7.2 4ZM7.2 10.4H8.8V12H7.2V10.4Z"
                                            fill="#A9ACAF"
                                        />
                                    </svg>
                                </HTMLTooltip>
                            </div> */}
                        <div className="title-graph-right">{/* <TypeBanner situation={'info'} value={achievesForTypes.value} /> */}</div>
                        {sessions.userType === 'students' ? (
                            <>
                                {!teacherFeedbackContents.renderContents ? (
                                    <>피드백이 없습니다.</>
                                ) : (
                                    <>
                                        <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M11.1755 0.0157251C11.4912 -0.047176 11.6806 0.0786284 11.7437 0.393139C11.8069 0.644745 11.6806 0.802003 11.3649 0.864904C9.02877 1.36812 7.10308 2.18585 5.58773 3.31808C4.13556 4.38742 3.40947 5.55112 3.40947 6.80914C3.40947 7.56397 3.66203 8.16153 4.16713 8.60186C4.73538 9.04219 6.40852 9.57683 9.18661 10.2058C11.1439 10.7091 12.5645 11.4325 13.4485 12.376C14.3956 13.3195 14.8691 14.5461 14.8691 16.0557C14.8691 17.7541 14.2693 19.1694 13.0696 20.3016C11.87 21.4339 10.3231 22 8.42898 22C5.96657 22 3.94615 21.1508 2.36769 19.4524C0.789231 17.6912 0 15.4582 0 12.7534C0 9.48247 0.978645 6.74623 2.93593 4.54467C4.95634 2.3431 7.70287 0.833454 11.1755 0.0157251ZM30.2117 0.0157251C30.5274 -0.047176 30.7168 0.0786284 30.78 0.393139C30.9062 0.644745 30.8115 0.802003 30.4958 0.864904C28.1597 1.36812 26.234 2.18585 24.7187 3.31808C23.2665 4.38742 22.5404 5.55112 22.5404 6.80914C22.5404 7.56397 22.7929 8.16153 23.298 8.60186C23.8032 9.04219 25.4447 9.57683 28.2228 10.2058C30.2433 10.7091 31.6954 11.4325 32.5794 12.376C33.5264 13.3195 34 14.5461 34 16.0557C34 17.7541 33.4002 19.1694 32.2005 20.3016C31.0009 21.4339 29.4541 22 27.5599 22C25.0975 22 23.077 21.1194 21.4986 19.3581C19.9202 17.534 19.1309 15.238 19.1309 12.4703C19.1309 9.26233 20.1096 6.589 22.0669 4.45032C24.0242 2.31165 26.7391 0.833454 30.2117 0.0157251Z"
                                                fill="#AEFFE0"
                                            />
                                        </svg>
                                        <TeacherFeedbackViewer contents={teacherFeedbackContents.renderContents} />
                                    </>
                                )}
                            </>
                        ) : (
                            <TeacherFeedbackWriter
                                deltaContents={teacherFeedbackContents.deltaContents}
                                actionUpdateClick={actionUpdateTeacherFeedback}
                            />
                        )}
                    </section>
                </div>
            </ClassWrapper>
        </>
    );
}

export default React.memo(withRouter(ReportStudent));
