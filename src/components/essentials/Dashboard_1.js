import React, { useEffect, useState } from 'react';
import icon_image from '../../images/dashboard_icon.png';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Dday from '../../pages/Dday';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import Button from '../../AltridUI/Button/Button';
import MakeAutoComments from '../../controllers/MakeAutoComment';
import BackgroundTheme from '../../AltridUI/ThemeColors/BackgroundTheme';
import { getColorSets } from '../../AltridUI/ThemeColors/ColorSets';
import { withStyles } from '@material-ui/core';
import Typography from '../../AltridUI/Typography/Typography';

const Container = styled.div`
    margin: 0px auto;
    max-width: 1216px;
    margin-bottom: 84px;
    padding: 0 32px;
    & .gobutton {
        margin-top: 68px;
    }
    & .header {
        height: 80px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 27px;

        & .icon {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 65px;
            height: 36px;

            & p {
                font-weight: bold;
                color: #6c46a1;
                font-size: 16px;
                letter-spacing: -0.02em;
                margin: 0px 8px;
                padding: 8px 16px;
                border-radius: 104px;
                background: #f4f1fa;
            }
        }
        & .plan {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 128px;
            height: 36px;
            background: #6c46a1;
            border-radius: 104px;
            color: #ffffff;
            font-weight: bold;
            font-size: 16px;
            text-align: center;

            & p {
                margin: 0px 8px;
            }
        }
    }

    & .greeting {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-height: 260px;
        margin-bottom: 16px;

        & h2 {
            font-weight: 700;
            font-size: 56px;

            margin-bottom: 8px;
            margin-top: 16px;
            @media (min-width: 0px) and (max-width: 520px) {
                font-size: 28px;
                /* white-space: pre-wrap; */
            }
            @media (min-width: 520px) and (max-width: 715px) {
                font-size: 35px;
            }
        }

        & .right {
            & img {
                max-width: 339px;
                max-height: 260px;
                @media (min-width: 0px) and (max-width: 520px) {
                    max-width: 235px;
                    width: 100%;
                    max-height: 200px;
                }
            }
        }
    }

    & .dashboard {
        margin: 0 auto;
    }
    @media all and (max-width: 640px) {
        padding: 0 16px;
    }
`;
const DashCard = styled.div`
    align-items: flex-start;
    background-color: ${({ color }) => getColorSets(50, color)};
    border: 1px solid transparent;
    border-color: ${({ borderColor }) => (borderColor ? borderColor : null)};
    border-radius: 32px;
    color: ${({ color }) => (color === 'white' ? '#11171C' : getColorSets(500, color))};
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 32px;
    min-height: 190px;
    @media all and (max-width: 640px) {
        padding: 24px;
    }
`;
const DashCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;
const DashCardTitle = styled.div``;
const DashCardHeaderRight = styled.div``;
const DashCardContents = styled.div`
    color: ${({ color, disabled }) => (color === 'white' ? (disabled ? '#9AA5AF' : '#4D5C6A') : getColorSets(disabled ? 200 : 400, color))};
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    width: 100%;
    &.center {
        justify-content: center;
        text-align: center;
    }
`;
const DashCardBottom = styled.div`
    display: flex;
    margin-top: auto;
    width: 100%;
    & a {
        width: 100%;
    }
    &.center {
        justify-content: center;
        & a {
            text-align: center;
        }
    }
`;
const AssignmentListItem = styled.div`
    align-items: center;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 1;
    & + & {
        margin-top: 16px;
    }
    @media all and (max-width: 640px) {
        align-items: flex-start;
        & + & {
            margin-top: 16px;
        }
    }
`;
const AssignmentListItemDDayTag = styled.div`
    align-items: center;
    background-color: ${({ dday }) => (dday ? '#FED7D2' : '#D4E2FC')};
    border-radius: 8px;
    color: ${({ dday }) => (dday ? '#870F00' : '#174291')};
    display: flex;
    flex-basis: 48px;
    flex-shrink: 0;
    justify-content: center;
    padding: 4px 8px;
    @media all and (max-width: 640px) {
        flex-basis: initial;
    }
`;
const AssignmentListItemTexts = styled.div`
    align-items: center;
    color: #11171c;
    display: flex;
    margin-left: 8px;
    overflow: hidden;
    width: 100%;
    @media all and (max-width: 640px) {
        margin: 0;
        margin-top: 4px;
    }
`;
const AssignmentListItemTitle = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    & div.altrid-typography {
        overflow: inherit;
        text-overflow: inherit;
    }
`;
const AssignmentListItemDesc = styled.div`
    margin-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    & div.altrid-typography {
        overflow: inherit;
        text-overflow: inherit;
    }
`;
const TodoListItem = styled.div`
    align-items: center;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 1;
    & + & {
        margin-top: 8px;
    }
    & div.altrid-typography {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }
    @media all and (max-width: 640px) {
        align-items: flex-start;
        & + & {
            margin-top: 8px;
        }
    }
`;
const GridResponsive = withStyles((theme) => ({
    'spacing-xs-4': {
        '@media (max-width: 1023px)': {
            width: 'calc(100% + 16px)',
            margin: -8,
            '& .MuiGrid-item': {
                padding: 8,
            },
        },
        '@media (max-width: 640px)': {
            width: 'calc(100% + 8px)',
            margin: -4,
            '& .MuiGrid-item': {
                padding: 4,
            },
        },
    },
}))(Grid);

function Dashboard_1({ match, history }) {
    const [activedNum, setactiveNum] = useState('');
    // const [currentStudentData, setCurrentStudentData] = useState({});
    const urlSearchParams = new URLSearchParams(history.location.search);
    const queryUserId = urlSearchParams.get('user');
    const sessions = useSelector((state) => state.RdxSessions);
    const { num } = match.params;
    const classNum = match.params.num;
    const [meetingroom, Setmeetingroom] = useState([]);
    const [word, setword] = useState('');
    const [korean, setkorean] = useState('');
    const [flip, setflip] = useState(false);
    const [total, settotal] = useState('');
    const [assignment, setassignment] = useState([]);
    // 현재 날짜
    const [today, setdate] = useState(new Date());
    const [room, setroom] = useState([]);
    const [todo, settodo] = useState([]);
    const [studentsData, setStudentsData] = useState([]);
    const [chart, setchart] = useState({
        series: [0],
        options: {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#e7e7e7',
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2,
                        },
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px',
                        },
                    },
                },
            },
            grid: {
                padding: {
                    top: -10,
                    width: '300px',
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91],
                },
            },
            labels: ['WordProgress'],
        },
    });
    const [optimer, setoptimer] = useState({
        series: [
            {
                name: 'Optimer',
                data: [0, 0, 0, 0, 0, 0, 0],
            },
        ],
        options: {
            chart: {
                offsetY: -20,
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    borderRadius: 100,
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + '분';
                },
                offsetY: -20,
                style: {
                    fontSize: '15px',
                    colors: ['black'],
                },
            },

            xaxis: {
                categories: ['월', '화', '수', '목', '금', '토', '일'],
                position: 'bottom',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        },
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            yaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                },
            },
            title: {
                text: 'MY Study Time',
                floating: true,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444',
                },
            },
        },
    });
    // 클래스 정보
    const [classInfo, setClassInfo] = useState({ class_code: '', class_day: '', name: '', description: '' });

    useEffect(() => {
        Axios.get(`${apiUrl}/meeting-room/livelecture`, { withCredentials: true })
            .then((result) => {
                Setmeetingroom(result.data);
            })
            .catch((err) => console.log(err));

        Axios.get(`${apiUrl}/meeting-room`, { params: { classNumber: classNum }, withCredentials: true })
            .then((result) => {})
            .catch((err) => console.log(err));

        // 클래스 정보 가져오기
        Axios.get(`${apiUrl}/classes/infos/${classNum}`, { withCredentials: true })
            .then((result) => {
                if (!result || !result.data) return;
                setClassInfo({ ...classInfo, ...result.data });
                // console.log(result.data);
            })
            .catch((err) => console.log(err));

        // 진행중인 과제 목록 불러오기
        Axios.get(`${apiUrl}/assignment-actived/${num}`, { withCredentials: true })
            .then((result) => {
                // console.log(result.data);
                if (!result.data || !result.data.length) return;
                setassignment(
                    result.data
                        .filter(({ due_date }) => Math.ceil((new Date(due_date).getTime() - today.getTime()) / (1000 * 3600 * 24)) > 0)
                        .slice(0, 3),
                );
            })
            .catch((err) => console.log(err));

        // 랜덤 단어 가져오기
        Axios.get(`${apiUrl}/vocas/random`, { params: { classNum: classNum }, withCredentials: true })
            .then((result) => setword(result.data.word))
            .catch((err) => console.log(err));

        // 단어 진행률 가져오기
        Axios.get(`${apiUrl}/vocas/progress`, { params: { classNum: classNum }, withCredentials: true })
            .then((result) => {
                // console.log(result.data);
                settotal(result.data);
                setchart({
                    ...chart,
                    series: [Math.ceil((result.data.progress / result.data.total) * 100)],
                });
            })

            .catch((err) => console.log(err));

        // 캠 스터디 목록 가져오기
        Axios.get(`${apiUrl}/cam-study/all`, { withCredentials: true })
            .then((result) => {
                setroom(result.data);
            })
            .catch((err) => console.log(err));

        Axios.get(`${apiUrl}/calendar-events/my/${num}/current`, { withCredentials: true })
            .then((result) => {
                // console.log(result.data);
                settodo(result.data);
            })
            .catch((err) => console.log(err));

        // 최근 과제 데이터 가져오기
        Axios.get(`${apiUrl}/assignment-result/last-my-actived/${classNum}`, { withCredentials: true })
            .then((result) => {
                // console.log(result.data);
                Axios.get(`${apiUrl}/assignment-result/${result.data.actived_number}`, {
                    params: {
                        classNumber: classNum,
                    },
                    withCredentials: true,
                })
                    .then((result) => {
                        // console.log(result.data['curr'][0].);
                        setStudentsData(result.data['curr']);
                    })
                    .catch((err) => {
                        console.error(err);
                    });

                // 옵타이머 데이터
                Axios.get(`${apiUrl}/optimer/${num}/${result.data.student_id}`, { withCredentials: true })
                    .then((result) => {
                        if (!result.data.time_mon) {
                            return;
                        }
                        setoptimer({
                            ...optimer,
                            series: [
                                {
                                    name: 'optimer',
                                    data: [
                                        Math.floor(result.data.time_mon / 60000),
                                        Math.floor(result.data.time_tue / 60000),
                                        Math.floor(result.data.time_wed / 60000),
                                        Math.floor(result.data.time_thu / 60000),
                                        Math.floor(result.data.time_fri / 60000),
                                        Math.floor(result.data.time_sat / 60000),
                                        Math.floor(result.data.time_sun / 60000),
                                    ],
                                },
                            ],
                        });
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }, []);

    const ClickCard = () => {
        Axios({
            url: `https://dapi.kakao.com/v2/translation/translate?src_lang=en&target_lang=kr&query=${word}`,
            type: 'GET',
            headers: { Authorization: 'KakaoAK deff2bf52bcadf12b544be630be9846b' },
        })
            .then((result) => setkorean(result.data.translated_text[0]))
            .catch((error) => console.log(error));
        if (!flip) {
            setflip(true);
        } else {
            setflip(false);
        }
    };

    const [acmTotalFixsMine, setACMTotalFixsMine] = useState(0);
    const [acmTotalFixsAvg, setACMTotalFixsAvg] = useState(0);
    const [acmAvgSpeedFixsMine, setACMAvgSpeedFixsMine] = useState(0);
    const [acmAvgSpeedFixsAvg, setACMAvgSpeedFixsAvg] = useState(0);
    const [acmRegressionsMine, setACMRegressionsMine] = useState(0);
    const [acmRegressionsAvg, setACMRegressionsAvg] = useState(0);

    useEffect(() => {
        if (!studentsData || !studentsData.length) return;
        const currentStudentData = studentsData.filter((p) => p.student_id === sessions.authId)[0];
        setACMTotalFixsMine(currentStudentData.num_of_fixs);
        setACMAvgSpeedFixsMine(currentStudentData.avg_of_fix_vels);
        setACMRegressionsMine(currentStudentData.num_of_regs);

        // 학생들 데이터 합
        const totalEyeStatsSum = studentsData.reduce((a, b) => ({
            num_of_fixs: a.num_of_fixs + b.num_of_fixs,
            avg_of_fix_durs: a.avg_of_fix_durs + b.avg_of_fix_durs,
            avg_of_fix_vels: a.avg_of_fix_vels + b.avg_of_fix_vels,
            num_of_sacs: a.num_of_sacs + b.num_of_sacs,
            var_of_sac_vels: a.var_of_sac_vels + b.var_of_sac_vels,
            cluster_area: a.cluster_area + b.cluster_area,
            cluster_counts: a.cluster_counts + b.cluster_counts,
            num_of_regs: a.num_of_regs + b.num_of_regs,
        }));
        // 학생 평균 데이터
        const totalEyeStatsAvg = {};
        Object.keys(totalEyeStatsSum).forEach((name) => {
            totalEyeStatsAvg[name] = (totalEyeStatsSum[name] / studentsData.length) * 1.0;
        });

        setACMTotalFixsAvg(totalEyeStatsAvg.num_of_fixs.toFixed(0));
        setACMAvgSpeedFixsAvg(totalEyeStatsAvg.avg_of_fix_vels.toFixed(0));
        setACMRegressionsAvg(totalEyeStatsAvg.num_of_regs.toFixed(0));
    }, [studentsData]);
    // new Date(b.due_date).getTime - new Date(a.due_date).getTime;

    const newAssignment = assignment.sort(function (a, b) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
    // console.log(newAssignment);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [layoutSet, setLayoutSet] = useState(false);
    useEffect(() => {
        const updateWindowDimensions = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', updateWindowDimensions);
        return () => window.removeEventListener('resize', updateWindowDimensions);
    }, []);

    useEffect(() => {
        if (screenWidth < 1024) setLayoutSet(true);
        else setLayoutSet(false);
    }, [screenWidth]);

    const cardSelectRender = (layoutSet) => {
        const todayWordCard = (
            <GridResponsive item xs={12} xl={4} sm={layoutSet ? 6 : 4}>
                <DashCard color="orange">
                    <DashCardHeader>
                        <DashCardTitle>
                            <Typography type="label" size="xxl" bold>
                                오늘의 단어
                            </Typography>
                        </DashCardTitle>
                        <DashCardHeaderRight></DashCardHeaderRight>
                    </DashCardHeader>
                    <DashCardContents className="center" color="orange" disabled={!word}>
                        {!word ? (
                            <Typography type="label" size="xl" bold>
                                단어가 없습니다
                            </Typography>
                        ) : (
                            <Typography onClick={ClickCard}>{flip ? korean : word}</Typography>
                        )}
                    </DashCardContents>
                    <DashCardBottom className="center">
                        {word ? (
                            <Link to={`/class/${num}/learning-vocas`}>
                                <Typography type="label" size="xl" bold>
                                    더 많은 단어 학습하기
                                </Typography>
                            </Link>
                        ) : null}
                    </DashCardBottom>
                </DashCard>
            </GridResponsive>
        );
        const assignmentStatusCard = (
            <GridResponsive item xs={12} xl={8} sm={layoutSet ? 12 : 8}>
                <DashCard color="gray">
                    <DashCardHeader>
                        <DashCardTitle>
                            <Typography type="label" size="xxl" bold>
                                과제 현황
                            </Typography>
                        </DashCardTitle>
                        <DashCardHeaderRight>
                            <Link to={`/class/${num}/share`}>
                                <Button variant="outlined" colors="purple" sizes="xsmall">
                                    과제 목록 보기
                                </Button>
                            </Link>
                        </DashCardHeaderRight>
                    </DashCardHeader>
                    <DashCardContents color="gray" disabled={!newAssignment.length}>
                        {console.log(newAssignment)}
                        {newAssignment.length > 0 ? (
                            newAssignment.map((d) => (
                                <AssignmentListItem key={d.idx}>
                                    <AssignmentListItemDDayTag
                                        dday={Math.ceil((today.getTime() - new Date(d.due_date).getTime()) / (1000 * 3600 * 24)) === 0}
                                    >
                                        <Typography type="label" size="s" bold>
                                            {Math.ceil((today.getTime() - new Date(d.due_date).getTime()) / (1000 * 3600 * 24)) === 0
                                                ? 'D-Day'
                                                : 'D' + Math.ceil((today.getTime() - new Date(d.due_date).getTime()) / (1000 * 3600 * 24))}
                                        </Typography>
                                    </AssignmentListItemDDayTag>
                                    <AssignmentListItemTexts>
                                        <AssignmentListItemTitle>
                                            <Typography type="label" size="xl" bold title={d.title}>
                                                {d.title}
                                            </Typography>
                                        </AssignmentListItemTitle>
                                        <AssignmentListItemDesc>
                                            <Typography type="label" size="xl" title={d.description}>
                                                {d.description}
                                            </Typography>
                                        </AssignmentListItemDesc>
                                    </AssignmentListItemTexts>
                                </AssignmentListItem>
                            ))
                        ) : (
                            <Typography type="label" size="xl" bold>
                                진행 중인 과제가 없습니다.
                            </Typography>
                        )}
                    </DashCardContents>
                    <DashCardBottom></DashCardBottom>
                </DashCard>
            </GridResponsive>
        );
        if (layoutSet) {
            return (
                <>
                    {assignmentStatusCard}
                    {todayWordCard}
                </>
            );
        } else {
            return (
                <>
                    {todayWordCard}
                    {assignmentStatusCard}
                </>
            );
        }
    };

    return (
        <>
            <BackgroundTheme color="#ffffff" />
            <Container>
                <div className="greeting">
                    <div className="left">
                        <svg width="71" height="47" viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                fill="#AEFFE0"
                            />
                        </svg>
                        <h2>{classInfo.name} 클래스 입니다.</h2>
                        <Dday classNum={num} />
                    </div>
                    <div className="right">
                        <img src={icon_image} alt="dashboard_icons"></img>
                    </div>
                </div>
                <div className="dashboard">
                    <Box sx={{ flexGrow: 1 }}>
                        <GridResponsive container spacing={4}>
                            <GridResponsive item xs={12} xl={4} sm={layoutSet ? 6 : 4}>
                                <DashCard color="purple">
                                    <DashCardHeader>
                                        <DashCardTitle>
                                            <Typography type="label" size="xxl" bold>
                                                강의실
                                            </Typography>
                                        </DashCardTitle>
                                        <DashCardHeaderRight></DashCardHeaderRight>
                                    </DashCardHeader>
                                    <DashCardContents color="purple" disabled={!meetingroom.length}>
                                        <Typography type="label" size="xl" bold>
                                            {console.log(meetingroom)}
                                            {meetingroom.length > 0 ? '현재 진행 중인 강의가 있습니다.' : '진행 중인 강의가 없습니다.'}
                                        </Typography>
                                    </DashCardContents>
                                    <DashCardBottom>
                                        <Link to={`/class/${num}/vid-lecture`}>
                                            <Button fullWidth colors="purple" variant="filled">
                                                강의실로 이동
                                            </Button>
                                        </Link>
                                    </DashCardBottom>
                                </DashCard>
                            </GridResponsive>
                            <GridResponsive item xs={12} xl={4} sm={layoutSet ? 6 : 4}>
                                <DashCard color="blue">
                                    <DashCardHeader>
                                        <DashCardTitle>
                                            <Typography type="label" size="xxl" bold>
                                                캠 스터디
                                            </Typography>
                                        </DashCardTitle>
                                        <DashCardHeaderRight></DashCardHeaderRight>
                                    </DashCardHeader>
                                    <DashCardContents color="blue" disabled={!room.length}>
                                        <Typography type="label" size="xl" bold>
                                            {room.length > 0 ? (
                                                <>
                                                    총 {room.length} 개의 방이 있습니다. <br />
                                                    함께 공부해보세요
                                                </>
                                            ) : (
                                                '현재 공부중인 방이 없습니다.'
                                            )}
                                        </Typography>
                                    </DashCardContents>
                                    <DashCardBottom>
                                        <Link to={`/class/${num}/cam-study`}>
                                            <Button colors="blue" fullWidth variant="filled">
                                                캠 스터디 목록
                                            </Button>
                                        </Link>
                                    </DashCardBottom>
                                </DashCard>
                            </GridResponsive>
                            {cardSelectRender(layoutSet)}
                            <GridResponsive item xl={4} xs={12} sm={layoutSet ? 6 : 4}>
                                <DashCard color="yellow">
                                    <DashCardTitle>
                                        <Typography type="label" size="xxl" bold>
                                            단어 진행률
                                        </Typography>
                                    </DashCardTitle>
                                    <DashCardContents color="yellow" disabled={!total.total}>
                                        {!total.total ? (
                                            <Typography type="label" size="xl" bold>
                                                저장된 단어가 없습니다.
                                            </Typography>
                                        ) : (
                                            <>
                                                <ReactApexChart
                                                    options={chart.options}
                                                    series={chart.series}
                                                    type="radialBar"
                                                    height={240}
                                                />
                                            </>
                                        )}
                                    </DashCardContents>
                                    <DashCardBottom className="center">
                                        {total.total ? (
                                            <Typography type="label" size="xl" bold>
                                                {total.progress}/{total.total}
                                            </Typography>
                                        ) : null}
                                    </DashCardBottom>
                                </DashCard>
                            </GridResponsive>
                            <GridResponsive item xl={8} xs={12} sm={8}>
                                <DashCard color="white" borderColor="#BFC6CD">
                                    <DashCardTitle>
                                        <svg
                                            width="71"
                                            height="47"
                                            viewBox="0 0 71 47"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ marginBottom: -21 }}
                                        >
                                            <path
                                                d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                                fill="#BFC6CD"
                                            />
                                        </svg>
                                        <Typography type="label" size="xxl" bold>
                                            최근 과제 코멘트
                                        </Typography>
                                    </DashCardTitle>
                                    <DashCardContents color="white" disabled={!acmTotalFixsMine}>
                                        {acmTotalFixsMine === 0 ? (
                                            <Typography type="label" size="xl" bold>
                                                최근 풀이한 과제가 존재하지 않거나 제대로 된 측정이 이루어지지 않았습니다.
                                            </Typography>
                                        ) : (
                                            <Typography type="label" size="xl" bold>
                                                {MakeAutoComments(
                                                    sessions.userName,
                                                    acmTotalFixsMine,
                                                    acmTotalFixsAvg,
                                                    acmAvgSpeedFixsMine,
                                                    acmAvgSpeedFixsAvg,
                                                    acmRegressionsMine,
                                                    acmRegressionsAvg,
                                                )}
                                            </Typography>
                                        )}
                                    </DashCardContents>
                                    <DashCardBottom></DashCardBottom>
                                </DashCard>
                            </GridResponsive>
                            <GridResponsive item xs={12} xl={4} sm={4}>
                                <DashCard color="green">
                                    <DashCardTitle>
                                        <Typography type="label" size="xxl" bold>
                                            오늘의 할 일
                                        </Typography>
                                    </DashCardTitle>
                                    <DashCardContents color="green" disabled={!todo.length}>
                                        {!todo.length ? (
                                            <Typography type="label" size="xl" bold>
                                                일정이 없습니다.
                                            </Typography>
                                        ) : (
                                            todo.slice(0, 3).map((d, i) => (
                                                <TodoListItem key={i}>
                                                    <Typography type="label" size="xl" bold>
                                                        {i + 1}. {d.title}
                                                    </Typography>
                                                </TodoListItem>
                                            ))
                                        )}
                                    </DashCardContents>
                                    <DashCardBottom>
                                        <Link to={`/class/${num}/calendar`}>
                                            <Button fullWidth variant="filled" colors="green">
                                                나의 일정 보러가기
                                            </Button>
                                        </Link>
                                    </DashCardBottom>
                                </DashCard>
                            </GridResponsive>
                            <GridResponsive item xs={12}>
                                <DashCard color="gray">
                                    <DashCardTitle>
                                        <Typography type="label" size="xxl" bold>
                                            나의 주간 학습 시간
                                        </Typography>
                                    </DashCardTitle>
                                    <DashCardContents color="gray">
                                        {!sessions ? null : (
                                            <ReactApexChart
                                                style={{ overflow: 'hidden' }}
                                                options={optimer.options}
                                                series={optimer.series}
                                                type="bar"
                                                height={300}
                                            />
                                        )}
                                    </DashCardContents>
                                    <DashCardBottom></DashCardBottom>
                                </DashCard>
                            </GridResponsive>
                        </GridResponsive>
                    </Box>
                </div>
            </Container>
        </>
    );
}

export default Dashboard_1;
