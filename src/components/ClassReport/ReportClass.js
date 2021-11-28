import React, { useCallback, useEffect, useState } from 'react';
import ClassWrapper from '../essentials/ClassWrapper';
import IsPresence from '../essentials/IsPresence';
import ToggleSwitch from '../essentials/ToggleSwitch';
import ClassDialog from '../essentials/ClassDialog';
import ModifyButton from '../essentials/ModifyButton';
import StudentNum from '../essentials/StudentNum';
import TotalProgress from './TotalProgress';
import CardStudent from './CardStudent';
import CardRoot from '../essentials/CardRoot';
import CardLists from '../essentials/CardLists';
import styled from 'styled-components';
import ColumnChartProblem from '../essentials/ColumnChartProblem';
import ColumnChartType from '../essentials/ColumnChartType';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import moment from 'moment-timezone';
import getAchieveValueForTypes from '../essentials/GetAchieveValueForTypes';
import ProblemCategories from '../TOFELEditor/ProblemCategories';
import CSATCategories from '../TOFELEditor/CSATCategories';
import TypeBanner from '../essentials/TypeBanner';
import { useSelector, useDispatch } from 'react-redux';
import ClassDialogDelete from '../essentials/ClassDialogDelete';
import { patchActivedOnly, changeDueDate, deleteActived, getActivedOnly, patchActived } from '../../redux_modules/assignmentActived';
import { getServerDate } from '../../redux_modules/serverdate';
import BackdropComponent from '../essentials/BackdropComponent';
import Error from '../../pages/Error';
import { changeParams } from '../../redux_modules/params';
import { withRouter } from 'react-router-dom';
import { SecondsToHoursAndMinutes } from '../essentials/TimeChange';
import { Link } from '@material-ui/core';
import GroupBox from '../../AltridUI/GroupBox/GroupBox';
import Button from '../../AltridUI/Button/Button';
import DrawerGroupBox from '../../AltridUI/Drawer/DrawerGroupBox';
import CategorySelector from '../../controllers/CategorySelector';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${pad(parseInt(secs / 60), 2)}분 ${pad(Math.floor(secs % 60), 2)}초`;
};

const LimitFuncWrapper = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 95%;
    height: 95%;
    background: #ffffff3c;
    font-size: 1.2rem;
    font-weight: 500;
    z-index: 1000;
    color: rgb(96, 95, 96);
    & svg {
        margin-right: 15px;
    }
    @media (min-width: 0) and (max-width: 663px) {
        font-size: 0.85rem;
        text-align: center;
        & svg {
            margin-right: 5px;
        }
    }
`;

function ReportClass({ match, history }) {
    const { num, activedNum } = match.params;
    const dispatch = useDispatch();
    const serverdate = useSelector((state) => state.RdxServerDate);
    const RdxDueDate = useSelector((state) => state.assignmentActived.dueData.data);
    const { data, loading, error } = useSelector((state) => state.assignmentActived.activedData);

    /**전체 로딩 */
    const [mainLoading, setMainLoading] = useState({
        mainReportDataLoading: false,
        reduxDataLoading: loading,
        studentsDataLoading: false,
    });
    const [mainReportError, setMainReportError] = useState(null);
    /** class-dialog 메소드 */
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [deleteDialogopen, setDeleteDialogopen] = useState(false);
    const [testDialogopen, setTestDialogopen] = useState(false);
    /** 메인 데이터 및 각 요소 */
    const [mainReportData, setMainReportData] = useState(undefined);
    // 과제 제목
    const [title, setTitle] = useState('');
    // 과제 한 줄 설명
    const [description, setDescription] = useState('');
    // 과제 과목
    const [subject, setSubject] = useState(1);
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
    const [achievesForTypes, setAchievesForTypes] = useState({ value: 0, satisfieds: [], allExists: [] });
    /** 문제별 평균 정답률 */
    const [avgScoresOfNumber, setAvgScoresOfNumber] = useState([]);
    /** 전체 학생 영역별 평균 점수 데이터 */
    const [averageScoresOfType, setAverageScoresOfType] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
    window.averageScoresOfType = averageScoresOfType;
    /** 학생 별 이전 로우 데이터 */
    const [prevStudentsDataRaw, setPrevStudentsDataRaw] = useState([]);
    /** toggle state */
    const [toggleState, setToggleState] = useState({
        checked: false,
    });
    const [subTypeState, setSubTypeState] = useState('init');
    /** select state */
    const [selectState, setSelectState] = useState('0');

    const handleDialogOpen = (type) => {
        type === 'test' ? setTestDialogopen(true) : setDateDialogopen(true);
    };
    const handleDeleteDialogOpen = () => {
        setDeleteDialogopen(true);
    };
    const handleTestDialogClose = (e) => {
        const { name } = e.target;

        //과제 재시작
        if (name === 'button-restart') {
            if (RdxDueDate) {
                //console.log(mainReportData.idx, RdxDueDate);
                dispatch(patchActivedOnly(mainReportData.idx, RdxDueDate));
            } else {
                alert('과제 기한 변경은 필수사항 입니다.');
            }
            setTestDialogopen(false);
            dispatch(changeDueDate(''));
        }
        //과제 완료하기
        else if (name === 'button-complete') {
            dispatch(patchActivedOnly(mainReportData.idx, null));
            dispatch(getServerDate());

            setTestDialogopen(false);
        }
        //과제 완료 후, 삭제
        else if (name === 'button-delete') {
            setTestDialogopen(false);
            handleDeleteDialogOpen();
        }
        //x 또는 바깥 클릭했을 때
        else {
            setTestDialogopen(false);
            dispatch(changeDueDate(''));
        }
    };
    const handleDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'button-modify') {
            if (RdxDueDate) {
                dispatch(patchActivedOnly(mainReportData.idx, RdxDueDate));
                setDateDialogopen(false);
            } else {
                alert('과제 기한 변경은 필수사항 입니다.');
            }
        } else {
            setDateDialogopen(false);
        }

        dispatch(changeDueDate(''));
    };
    const handleDeleteDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'yes') {
            // console.log(cardData['idx']);
            dispatch(deleteActived(mainReportData.idx));
            setDeleteDialogopen(false);
        } else {
            setDeleteDialogopen(false);
        }
    };
    const handleToggleChange = () => {
        //setToggleState({ ...toggleState, [event.target.name]: event.target.checked });

        toggleState['checked'] ? setSubTypeState('init') : setSubTypeState('modify');
        handleDialogOpen('test');
    };
    const handleDateChange = () => {
        handleDialogOpen('date');
    };
    const handleSelect = (e) => {
        setSelectState(e.target.value);
    };
    /** 학생 카드 정렬 */
    const handleSortStudentsCard = ({ target }) => {
        const { name, value } = target;

        if (name === 'student-option') {
            switch (value) {
                // 제출 순
                case '0':
                    setStudentsData(
                        studentsData
                            .sort((a, b) => {
                                if (a.updated === b.updated) {
                                    return 0;
                                } else if (!a.updated) {
                                    return 1;
                                } else if (!b.updated) {
                                    return -1;
                                } else {
                                    return a.updated < b.updated ? 1 : -1;
                                }
                            })
                            .map((d) => d),
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
                            .sort((a, b) => {
                                if (a.score_percentage === b.score_percentage) {
                                    return 0;
                                } else if (a.score_percentage === null) {
                                    return 1;
                                } else if (b.score_percentage === null) {
                                    return -1;
                                } else {
                                    return a.score_percentage < b.score_percentage ? 1 : -1;
                                }
                            })
                            .map((d) => d),
                    );
                    break;
                // 소요시간 순
                case '3':
                    setStudentsData(
                        studentsData
                            .sort((a, b) => {
                                if (a.time === b.time) {
                                    return 0;
                                } else if (a.time === null) {
                                    return 1;
                                } else if (b.time === null) {
                                    return -1;
                                } else {
                                    return a.time < b.time ? 1 : -1;
                                }
                            })
                            .map((d) => d),
                    );
                    break;
                default:
                    break;
            }
        }
    };

    /** 비동기 처리 */
    // 메인 정보 불러오기
    const fecthMainData = async () => {
        try {
            setMainReportError(null);
            setMainReportData(undefined);
            setMainLoading({
                ...mainLoading,
                mainReportDataLoading: true,
            });
            ///// 1. 메인 리포트 데이터
            const mainRes = await Axios.get(`${apiUrl}/assignment-actived/${parseInt(num)}/${parseInt(activedNum)}`, {
                withCredentials: true,
            });
            let unparsedContentsData = mainRes.data.contents_data;

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
            setMainReportData({ ...mainRes.data, contents_data: JSON.parse(unparsedContentsData) });

            ///// 2. 학생별 정보 데이터
            const studentsRes = await Axios.get(`${apiUrl}/assignment-result/${parseInt(activedNum)}`, {
                params: {
                    classNumber: num,
                },
                withCredentials: true,
            });

            const convertedData = studentsRes.data['curr'].map((data) => {
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
                    eyetrack_data: null, // JSON.parse(unparsedEyetrackData),
                    category_score: _categoryScore,
                };
            });
            setStudentsData(convertedData);
            setPrevStudentsDataRaw(studentsRes.data['prev']);
        } catch (e) {
            setMainReportError(e);
            console.log(e);
        }

        setMainLoading({
            ...mainLoading,
            mainReportDataLoading: false,
        });
    };
    // 학생 데이터
    const fecthCalculateStudentData = async () => {
        setAvgScoresOfNumber([]);
        setAverageScoresOfType({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
        setMainLoading({
            ...mainLoading,
            studentsDataLoading: true,
        });

        try {
            /** 여기에 계산함수 구현하면 됩니다. */
            const _sumOfScoresPerNumbers = {};
            const len = studentsData
                .filter(({ submitted, user_data }) => submitted && user_data)
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
        } catch (e) {
            console.error(e);
        }
        setMainLoading({
            ...mainLoading,
            studentsDataLoading: false,
        });
    };

    useEffect(() => {
        let abortController = new AbortController();

        fecthMainData();

        return () => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        if (!mainReportData) return;
        console.log(mainReportData);

        setTitle(mainReportData.title);
        setDescription(mainReportData.description);
        setSubject(mainReportData.subject);
        setEyetrack(mainReportData.eyetrack);
        setTimeLimit(mainReportData.time_limit);
        setStartDate(moment(mainReportData.created).format('MM.DD HH:mm'));
        setDueDate(moment(mainReportData.due_date).format('MM.DD HH:mm'));
        dispatch(getActivedOnly(mainReportData.idx, mainReportData.created, mainReportData.due_date));
        dispatch(changeParams(2, activedNum));

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
            setAchievesForTypes(getAchieveValueForTypes(Object.keys(_o).map((k) => _o[k])), 3);
        }
    }, [mainReportData]);

    useEffect(() => {
        if (!data) return;

        setStartDate(moment(data.created).format('MM.DD HH:mm'));
        setDueDate(moment(data.due_date).format('MM.DD HH:mm'));

        setToggleState({
            checked: new Date(data.due_date).getTime() >= serverdate.datetime && new Date(data.created).getTime() <= serverdate.datetime,
        });
        return () => {};
    }, [data]);

    useEffect(() => {
        if (!studentsData || studentsData.length < 1) return;

        fecthCalculateStudentData();
    }, [studentsData]);

    //error check 1. 우리반이 아닌 다른 반 리포트에 접근할려고 할때
    if (data && data.idx === undefined) return <Error />;

    //error check 2. 데이터 전체가 로딩 완료될때까지는 back-drop
    if (
        data === null ||
        avgScoresOfNumber.length === 0 ||
        mainLoading.mainReportData ||
        mainLoading.reduxData ||
        mainLoading.studentsDataLoading
    ) {
        return <BackdropComponent open={true} />;
    }

    return (
        <div style={{ width: '100%', paddingBottom: '200px' }}>
            <ClassDialog type="test" subType={subTypeState} open={testDialogopen} handleDialogClose={handleTestDialogClose} />
            <ClassDialog type="date" subType="modify" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />
            <ClassDialogDelete ver="assignment" open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />

            <ClassWrapper col={true}>
                {/* <ClassHeaderBox /> */}
                {/* <BranchNav deps="2" /> */}
                <div className="class-report-root">
                    <div className="class-report-header">
                        <div className="class-report-header-left">
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </div>
                        {/* <div className="class-report-header-right">
                            <IsPresence type="eye" able={eyetrack} align="left" fontSize="0.94rem" />
                            <ToggleSwitch
                                isStarted={new Date(mainReportData ? mainReportData.created : null).getTime() <= serverdate.datetime}
                                toggle={toggleState['checked']}
                                handleToggleChange={handleToggleChange}
                                type="share2"
                                name="checked"
                            />
                        </div> */}
                    </div>
                    <section className="class-report-info">
                        <div className="report-box">
                            <div className="report-row">
                                <span className="left-desc">문항수</span>
                                <span className="left-content">
                                    {problemNumbers}
                                    문제
                                </span>
                            </div>

                            <div className="report-row">
                                <span className="left-desc">제한 시간</span>
                                <span className="left-content">
                                    {timeLimit === -2
                                        ? '없음'
                                        : ((timeLimit) => {
                                              const parted = SecondsToHoursAndMinutes(timeLimit);
                                              let str = '';
                                              if (parted[0] > 0) str += parted[0] + '시간 ';
                                              str += parted[1] + '분';
                                              return str;
                                          })(timeLimit)}
                                </span>
                            </div>
                            <div className="report-row">
                                <span className="left-desc">과제 기한</span>
                                <span className="left-content tablet-responsive">
                                    <span>{startDate} ~ </span>{' '}
                                    <span>
                                        {dueDate} <ModifyButton handleDateChange={handleDateChange} />
                                    </span>
                                </span>
                            </div>
                            <div className="report-row">
                                <span className="left-desc">제출한 학생</span>
                                <span className="left-content">
                                    <span>
                                        {studentsData.filter((s) => s.submitted).length} / {studentsData.length}
                                    </span>
                                </span>
                            </div>
                        </div>
                        {/* <div className="report-box">
                            <div className="report-row">
                                <div className="right-top">제출한 학생</div>
                            </div>
                            <div className="report-row">
                                <div className="right-bottom">
                                    {studentsData.filter((s) => s.submitted).length} / {studentsData.length}
                                </div>
                            </div>
                        </div> */}
                    </section>
                    <section className="class-report-progress">
                        <GroupBox
                            title="채점 결과 요약"
                            rightComponent={
                                <Link href={`${match.url}/hands-up`}>
                                    <Button variant="light" colors="purple">
                                        학생 손들기 목록 확인
                                    </Button>
                                </Link>
                            }
                        />
                        <TotalProgress studentList={studentsData} problemNumbers={problemNumbers}></TotalProgress>
                    </section>

                    <section className="class-report-graph">
                        <GroupBox title="점수 비교 그래프"></GroupBox>
                        {achievesForTypes.value >= 100 ? (
                            <div style={{ display: 'flex', alignItems: 'center' }} className="descrition">
                                <svg
                                    style={{ marginRight: '6px', marginBottom: '8px' }}
                                    width="12"
                                    height="15"
                                    viewBox="0 0 12 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.29393 11C3.09593 10.1513 2.20259 9.45732 1.83593 8.99998C1.20805 8.21551 0.814559 7.26963 0.70077 6.27129C0.586981 5.27296 0.757528 4.26279 1.19276 3.35715C1.628 2.4515 2.31022 1.68723 3.16083 1.15237C4.01145 0.617512 4.99585 0.333824 6.00065 0.333984C7.00545 0.334145 7.98976 0.61815 8.8402 1.15328C9.69065 1.68841 10.3726 2.4529 10.8076 3.35869C11.2425 4.26447 11.4127 5.27469 11.2986 6.27299C11.1845 7.27129 10.7907 8.21705 10.1626 9.00132C9.79593 9.45798 8.90393 10.152 8.70593 11H3.29326H3.29393ZM8.66659 12.3333V13C8.66659 13.3536 8.52612 13.6927 8.27607 13.9428C8.02602 14.1928 7.68688 14.3333 7.33326 14.3333H4.66659C4.31297 14.3333 3.97383 14.1928 3.72379 13.9428C3.47374 13.6927 3.33326 13.3536 3.33326 13V12.3333H8.66659ZM6.66659 5.66998V2.99998L3.66659 7.00332H5.33326V9.66998L8.33326 5.66998H6.66659Z"
                                        fill="#FFC043"
                                    />
                                </svg>

                                <p style={{ marginBottom: '8px', marginRight: '6px' }}>과제 최소 조건을 만족하셨습니다.</p>
                                <a
                                    style={{ textDecoration: 'underline', marginBottom: '8px' }}
                                    href="https://www.notion.so/a4daf8676b2b4460b75613f25249abf3"
                                >
                                    조건 확인하기
                                </a>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center' }} className="descrition">
                                <svg
                                    style={{ marginRight: '6px', marginBottom: '8px' }}
                                    width="12"
                                    height="15"
                                    viewBox="0 0 12 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.29393 11C3.09593 10.1513 2.20259 9.45732 1.83593 8.99998C1.20805 8.21551 0.814559 7.26963 0.70077 6.27129C0.586981 5.27296 0.757528 4.26279 1.19276 3.35715C1.628 2.4515 2.31022 1.68723 3.16083 1.15237C4.01145 0.617512 4.99585 0.333824 6.00065 0.333984C7.00545 0.334145 7.98976 0.61815 8.8402 1.15328C9.69065 1.68841 10.3726 2.4529 10.8076 3.35869C11.2425 4.26447 11.4127 5.27469 11.2986 6.27299C11.1845 7.27129 10.7907 8.21705 10.1626 9.00132C9.79593 9.45798 8.90393 10.152 8.70593 11H3.29326H3.29393ZM8.66659 12.3333V13C8.66659 13.3536 8.52612 13.6927 8.27607 13.9428C8.02602 14.1928 7.68688 14.3333 7.33326 14.3333H4.66659C4.31297 14.3333 3.97383 14.1928 3.72379 13.9428C3.47374 13.6927 3.33326 13.3536 3.33326 13V12.3333H8.66659ZM6.66659 5.66998V2.99998L3.66659 7.00332H5.33326V9.66998L8.33326 5.66998H6.66659Z"
                                        fill="#FFC043"
                                    />
                                </svg>

                                <p style={{ marginBottom: '8px', marginRight: '6px' }}>과제 최소 조건을 만족하지 못했습니다.</p>
                                <a
                                    style={{ textDecoration: 'underline', marginBottom: '8px' }}
                                    href="https://www.notion.so/a4daf8676b2b4460b75613f25249abf3"
                                >
                                    조건 확인하기
                                </a>
                            </div>
                        )}

                        {/* <div className="class-report-title graph-title">
                            점수 비교 그래프
                            <div className="title-graph-right">
                                <TypeBanner
                                    situation={achievesForTypes.value < 100 ? 'warning' : 'success'}
                                    value={achievesForTypes.value}
                                />
                            </div>
                        </div> */}
                        <div className="graph-box-header">
                            <div className="tablet-responsive">
                                <div>
                                    <span>가장 취약한 문제 </span> {avgScoresOfNumber.indexOf(Math.min(...avgScoresOfNumber)) + 1}번 (
                                    {Math.min(...avgScoresOfNumber).toFixed(1)}%)
                                </div>
                                <div>
                                    <span>가장 취약한 영역 </span>
                                    {
                                        CategorySelector(subject).filter(
                                            (p) =>
                                                p.id ===
                                                achievesForTypes.allExists
                                                    .map((e) => ({ ...e, score: averageScoresOfType[e.category] }))
                                                    .sort((a, b) => (a.score > b.score ? 1 : b.score > a.score ? -1 : 0))[0].category,
                                        )[0].name
                                    }
                                    (
                                    {(
                                        achievesForTypes.allExists
                                            .map((e) => ({ ...e, score: averageScoresOfType[e.category] }))
                                            .sort((a, b) => (a.score > b.score ? 1 : b.score > a.score ? -1 : 0))[0].score * 100
                                    ).toFixed(1) || 0}
                                    %)
                                </div>
                            </div>
                            <div className="web-responsive">
                                <span style={{ color: '#4D5C6A' }}>가장 취약한 문제 </span>{' '}
                                <div style={{ color: '#FF6937' }}>
                                    {avgScoresOfNumber.indexOf(Math.min(...avgScoresOfNumber)) + 1}번 (
                                    {Math.min(...avgScoresOfNumber).toFixed(1)}%)
                                </div>
                            </div>
                            <div className="web-responsive">
                                <span style={{ color: '#4D5C6A' }}>가장 취약한 영역 </span>
                                <div style={{ color: '#FF6937' }}>
                                    {
                                        CategorySelector(subject).filter(
                                            (p) =>
                                                p.id ===
                                                achievesForTypes.allExists
                                                    .map((e) => ({ ...e, score: averageScoresOfType[e.category] }))
                                                    .sort((a, b) => (a.score > b.score ? 1 : b.score > a.score ? -1 : 0))[0].category,
                                        )[0].name
                                    }
                                    (
                                    {(
                                        achievesForTypes.allExists
                                            .map((e) => ({ ...e, score: averageScoresOfType[e.category] }))
                                            .sort((a, b) => (a.score > b.score ? 1 : b.score > a.score ? -1 : 0))[0].score * 100
                                    ).toFixed(1) || 0}
                                    %)
                                </div>
                            </div>
                            <div>
                                <select
                                    style={{ borderRadius: '104px', color: '#6C46A1', border: '1.5px solid #6C46A1' }}
                                    name="chart-option"
                                    onChange={handleSelect}
                                >
                                    <option value="0">문제별 정답률</option>
                                    <option value="1">유형별 정답률</option>
                                </select>
                            </div>
                        </div>
                        <div className="graph-box">
                            {selectState === '0' ? (
                                <ColumnChartProblem datas={avgScoresOfNumber} />
                            ) : achievesForTypes.value >= 100 ? (
                                <ColumnChartType
                                    datas={achievesForTypes.allExists.map((e) => ({ ...e, score: averageScoresOfType[e.category] }))}
                                    subject={subject}
                                />
                            ) : (
                                <>
                                    <LimitFuncWrapper>
                                        <svg id="Warning" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path
                                                id="패스_35"
                                                data-name="패스 35"
                                                d="M8,0a8,8,0,1,0,8,8A8.024,8.024,0,0,0,8,0ZM9.1,12.2H6.9V10.3H9.2v1.9Zm.1-7.4L8.6,9.2H7.4L6.8,4.8v-1H9.3v1Z"
                                                fill="#605f60"
                                            />
                                        </svg>
                                        과제를 더 다양한 문제로 만들어주세요!
                                    </LimitFuncWrapper>
                                    <ColumnChartType datas={0} subject={subject} />
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </ClassWrapper>

            <CardLists
                upperDeck={
                    <>
                        <GroupBox
                            title="학생별 리포트"
                            rightComponent={
                                <select
                                    style={{
                                        border: ' 1.5px solid #6C46A1',
                                        borderRadius: ' 104px',
                                        width: '97px',
                                        height: '28px',
                                        backgroundColor: '#F6F8F9',
                                        color: ' #6C46A1',
                                        textAlign: 'center',
                                    }}
                                    name="student-option"
                                    onChange={handleSortStudentsCard}
                                >
                                    <option value="0">제출 순</option>
                                    <option value="1">이름 순</option>
                                    <option value="2">점수 순</option>
                                    <option value="3">소요시간 순</option>
                                </select>
                            }
                        ></GroupBox>
                    </>
                }
            >
                {studentsData.map((data) => (
                    <CardRoot key={data.student_id} cardHeight="inherit">
                        <CardStudent
                            id={data.student_id}
                            data={data}
                            prevData={prevStudentsDataRaw.filter((p) => p.student_id === data.student_id)[0]}
                            totalProblems={problemNumbers}
                            achieveRates={achievesForTypes.value}
                            existsCategories={achievesForTypes.allExists}
                        />
                    </CardRoot>
                ))}
            </CardLists>
        </div>
    );
}

export default React.memo(withRouter(ReportClass));
